import { Client, Account, Databases, Storage, ID, Query } from "appwrite";

const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    projectId: "679e4ef1002c91e8b897",
    databaseId: "679e5e0c001780bf0b57",
    DATABASE_ID: "679e5e0c001780bf0b57",
    usersCollectionId: "679e5ebd000ea98aaa23",
    expertsCollectionId: "67b1695e001be00d06d4",
    storageId: "67b16cea0010fd5cd5ba",
    PRODUCTS_COLLECTION_ID: '67b0a8730016485c7db1',
    OFFERS_COLLECTION_ID: '67b1ef95001837db6236',
};

class AppwriteService {
    constructor() {
        this.client = new Client();
        this.client.setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);
        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async getUserDetails(userId) {
        try {
            const response = await this.databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.usersCollectionId,
                [Query.equal('userId', userId)]
            );
            return response.documents[0];
        } catch (error) {
            console.error("Error fetching user details:", error);
            return null;
        }
    }

    // Comprehensive session check
    async checkSession() {
        try {
            // Try to get the current session
            const session = await this.account.getSession('current');

            if (session) {
                try {
                    // Fetch user details
                    const userDetails = await this.getUserDetails(session.userId);
                    return {
                        session,
                        userDetails
                    };
                } catch (userFetchError) {
                    console.error("Error fetching user details:", userFetchError);
                    return false;
                }
            }

            return false;
        } catch (error) {
            // Different handling for different error scenarios
            if (error.code === 401) {
                // Unauthorized - likely an expired or invalid token
                console.log("Session expired or invalid");
                return false;
            }

            console.error("Unexpected session check error:", error);
            return false;
        }
    }

    // ✅ Send OTP for phone verification
    async sendOtp(phone) {
        try {
            const userId = ID.unique(); // Generate unique user ID
            sessionStorage.setItem('userId', userId);  // Save user ID
            sessionStorage.setItem('otpExpiry', Date.now() + 600000); // Set OTP expiry (10 min)

            console.log("Generated User ID:", userId); // Debugging

            // Send OTP
            const response = await this.account.createPhoneToken(userId, phone);

            // Check if OTP token is returned
            if (response && response.secret) {
                console.log("✅ OTP sent successfully:", response);
                return { success: true, message: "OTP sent successfully.", data: response };
            } else {
                console.log("❌ OTP not sent:", response);
                return { success: false, message: "Failed to send OTP. Please try again." };
            }

        } catch (error) {
            console.error("❌ OTP Send Error:", error);
            await this.cleanup();
            return { success: false, message: "An error occurred while sending OTP.", error };
        }
    }

    // // ✅ OTP Verification Function
    async verifyOtplogin(usserId, otp) {
        try {

            if (!usserId) throw new Error("User ID not found. Restart the process.");
            console.log("Verifying OTP with:", { usserId, otp }); // Debugging
            const verificationResponse = await this.account.updatePhoneSession(usserId, otp);

            if (verificationResponse?.$id) {
                console.log("OTP Verified Successfully!");
                return true; // Return true if OTP verification is successful
            } else {
                throw new Error("OTP verification failed.");
            }
        } catch (error) {
            console.error("OTP Verification Error:", error);
            throw error;
        }
    }

    // ✅ OTP Verification Function
    async verifyOtp(otp) {
        try {
            const userId = sessionStorage.getItem('userId');
            const otpExpiry = sessionStorage.getItem('otpExpiry');

            if (!userId) throw new Error("User ID not found. Restart the process.");
            if (!otpExpiry || Date.now() > parseInt(otpExpiry)) {
                await this.cleanup();
                throw new Error("OTP has expired. Please request a new one.");
            }

            console.log("Verifying OTP with:", { userId, otp }); // Debugging

            const verificationResponse = await this.account.updatePhoneSession(userId, otp);

            if (verificationResponse?.$id) {
                console.log("OTP Verified Successfully!");
                // ✅ Store session in sessionStorage after verification
                sessionStorage.setItem('sessionId', verificationResponse.$id);
                return verificationResponse; // Return the full session object
            } else {
                throw new Error("OTP verification failed.");
            }
        } catch (error) {
            console.error("OTP Verification Error:", error);
            throw error;
        }
    }
    // ✅ Check if the user already exists by phone number
    async checkIfUserExists(phone) {
        try {
            console.log("\n=== STARTING USER CHECK PROCESS ===");
            console.log("Timestamp:", new Date().toISOString());

            // 1️⃣ Strict Input Validation
            if (!phone || typeof phone !== 'string' || phone.trim() === '') {
                console.warn("Invalid phone input:", phone);
                return {
                    exists: false,
                    error: "Valid phone number is required"
                };
            }

            const trimmedPhone = phone.trim();
            const digitsOnly = trimmedPhone.replace(/\D/g, ''); // Remove non-numeric characters
            if (digitsOnly.length < 5) {
                console.warn("Phone number contains insufficient digits:", digitsOnly.length);
                return {
                    exists: false,
                    error: "Phone number must contain at least 5 digits"
                };
            }

            console.log("Searching for phone:", trimmedPhone);

            // 2️⃣ Query the Database (Ensure the attribute name is correct)
            const users = await this.databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.usersCollectionId,
                [Query.equal("phone", trimmedPhone)]
            );

            // 3️⃣ Debugging: Log the query results
            console.log("Full Query Response:", users);
            console.log("Total Documents:", users.total);
            console.log("Found Documents:", users.documents.length);

            // 4️⃣ Return Response
            if (users.documents.length > 0) {
                return {
                    exists: true,
                    userId: users.documents[0].userId  // Return the userId from the found document
                };
            } else {
                return false;
            }
        } catch (error) {
            console.error("=== ERROR IN checkIfUserExists ===");
            console.error("Error details:", error);

            return {
                exists: false,
                error: error.message,
                details: null
            };
        }
    }

    // ✅ Sign Up User Function with existence check
    async signup({ name, dob, phone, address, pincode, district, state, area, occupation, crops }) {
        try {
            // 1. Get the current session - this should exist from successful OTP verification
            const session = await this.account.getSession('current');
            if (!session) {
                throw new Error("No active session. Please verify your phone number first.");
            }

            // 2. Store user details in the database
            const userData = await this.databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.usersCollectionId,
                ID.unique(),
                {
                    userId: session.userId,        // Use the userId from the session
                    name,
                    dob,
                    phone,
                    address,
                    pincode,
                    district,
                    state,
                    // area,
                    occupation,
                    crops: occupation === 'farmer' ? crops : [],

                }
            );

            console.log("User registered successfully:", userData);
            return session;  // Return the existing session

        } catch (error) {
            console.error("Signup Error:", error);
            throw error;
        }
    }

    // ✅ Function to Handle OTP Verification and Signup
    async handleOtpAndSignup(otp, userData) {
        try {
            // Step 1: Verify OTP
            console.log('hello 3')
            const isOtpVerified = await this.verifyOtp(otp);
            // If OTP is incorrect, return false
            console.log('hello 4')
            if (!isOtpVerified) {
                console.log('hello--')
                return false;
            }
            // Check if session is still valid
            // const isSessionValid = await this.checkSession();
            // if (!isSessionValid) {
            //     throw new Error("Session expired. Please start over.");
            // }



            if (isOtpVerified) {
                // Step 2: Proceed with user signup if OTP is verified
                await this.signup(userData);
                console.log('hello 5')

                // Step 3: Redirect to login after successful signup
                // window.location.href = "/login";
                return true;
            }
        } catch (error) {
            console.error("Error during OTP verification or signup:", error);
            await this.cleanup();
            throw error;

        }
    }

    // Clean up method
    async cleanup() {
        try {
            // Attempt to delete current session
            await this.account.deleteSession('current');

            // Clear local storage
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('otpExpiry');
            sessionStorage.removeItem('sessionId');
        } catch (error) {
            console.error("Cleanup error:", error);
        }
    }



    //update user info function
    async updateUserDocument(userId, userData) {
        try {
            // First, query to find the document with matching userId
            const userDoc = await this.databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.usersCollectionId,
                [
                    Query.equal('userId', userId)
                ]
            );

            // Check if user document exists
            if (userDoc.documents.length === 0) {
                throw new Error('User document not found');
            }

            // Get the document ID from the found document
            const documentId = userDoc.documents[0].$id;

            // Now update the document using the actual document ID
            const response = await this.databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.usersCollectionId,
                documentId,
                userData
            );

            return response;
        } catch (error) {
            console.error('Error updating user document:', error);
            throw error;
        }
    };

    // New Expert-related methods
    async getExperts() {
        try {
            const response = await this.databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.expertsCollectionId
            );
            return response.documents;
        } catch (error) {
            console.error("Error fetching experts:", error);
            throw error;
        }
    }

    async createExpert(expertData) {
        try {
            const response = await this.databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.expertsCollectionId,
                ID.unique(),
                expertData
            );
            return response;
        } catch (error) {
            console.error("Error creating expert:", error);
            throw error;
        }
    }

    async deleteFileFromStorage(fileUrl) {
        try {
            // Check if fileUrl exists
            if (!fileUrl) return false;

            // More robust URL parsing
            const urlParts = fileUrl.split('/');
            // Find the 'files' segment and take the next part as the ID
            const filesIndex = urlParts.findIndex(part => part === 'files');
            if (filesIndex === -1 || filesIndex === urlParts.length - 1) {
                console.warn("Invalid file URL format:", fileUrl);
                return false;
            }

            const fileId = urlParts[filesIndex + 1];

            // Verify we have a valid ID
            if (!fileId) {
                console.warn("Could not extract file ID from URL:", fileUrl);
                return false;
            }

            try {
                await this.storage.deleteFile(
                    appwriteConfig.storageId,
                    fileId
                );
                return true;
            } catch (error) {
                // If file not found, just log a warning instead of throwing error
                if (error.code === 404) {
                    console.warn("File already deleted or not found:", fileId);
                    return true; // Return true as the file no longer exists
                }
                throw error; // Re-throw other errors
            }
        } catch (error) {
            console.error("Error in deleteFileFromStorage:", error);
            return false;
        }
    }

    async updateExpert(expertId, expertData) {
        try {
            // Get the existing expert data
            const existingExpert = await this.getExpertById(expertId);

            // Only proceed with image deletion if there's a new image and it's different
            if (expertData.image && existingExpert.image && expertData.image !== existingExpert.image) {
                try {
                    const oldFileId = existingExpert.image.split('/files/')[1]?.split('/')[0];
                    if (oldFileId) {
                        await this.storage.deleteFile(
                            appwriteConfig.storageId,
                            oldFileId
                        );
                        console.log("Successfully deleted old image:", oldFileId);
                    }
                } catch (error) {
                    console.warn("Error deleting old image:", error);
                    // Continue with update even if deletion fails
                }
            }

            // Clean the data before updating
            const cleanedData = { ...expertData };
            delete cleanedData.$databaseId;
            delete cleanedData.$collectionId;
            delete cleanedData.$id;
            delete cleanedData.$createdAt;
            delete cleanedData.$updatedAt;

            const response = await this.databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.expertsCollectionId,
                expertId,
                cleanedData
            );

            return response;
        } catch (error) {
            console.error("Error updating expert:", error);
            throw error;
        }
    }
    async deleteExpert(expertId) {
        try {
            // Get the expert data first to get the image URL
            const expert = await this.getExpertById(expertId);

            // If expert has an image, delete it from storage
            if (expert.image) {
                await this.deleteFileFromStorage(expert.image);
            }

            // Then delete the expert document
            await this.databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.expertsCollectionId,
                expertId
            );
            return true;
        } catch (error) {
            console.error("Error deleting expert:", error);
            throw error;
        }
    }

    async uploadExpertImage(file) {
        try {
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                throw new Error("File size exceeds 5MB limit");
            }

            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                throw new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed");
            }

            const upload = await this.storage.createFile(
                appwriteConfig.storageId,
                ID.unique(),
                file
            );

            // Get the file URL using getFileView instead of getFilePreview
            const fileUrl = this.storage.getFileView(
                appwriteConfig.storageId,
                upload.$id
            );

            console.log("Generated file URL:", fileUrl);
            return fileUrl.toString();
        } catch (error) {
            console.error("Error uploading expert image:", error);
            throw error;
        }
    }

    async createExpert(expertData) {
        try {
            // Ensure the image URL is properly set in expertData
            if (!expertData.image) {
                throw new Error("Expert image is required");
            }

            console.log("Creating expert with data:", expertData);

            const response = await this.databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.expertsCollectionId,
                ID.unique(),
                {
                    ...expertData,
                    image: expertData.image.toString() // Ensure image URL is a string
                }
            );

            console.log("Expert created successfully:", response);
            return response;
        } catch (error) {
            console.error("Error creating expert:", error);
            throw error;
        }
    }


    async getExpertById(expertId) {
        try {
            const response = await this.databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.expertsCollectionId,
                expertId
            );
            return response;
        } catch (error) {
            console.error("Error fetching expert:", error);
            throw error;
        }
    };

    async getAllProducts() {
        try {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.PRODUCTS_COLLECTION_ID,
                [
                    Query.orderDesc('$createdAt')
                ]
            );
            return response.documents;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    };


    // Make an offer on a product
    async makeOffer(productId, adminId, offerDetails) {
        try {
            // First create the offer
            const offer = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.OFFERS_COLLECTION_ID,
                ID.unique(),
                {
                    productId,
                    adminId,
                    offeredPrice: offerDetails.price,
                    notes: offerDetails.notes,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                }
            );

            // Then update the product with all required fields
            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.PRODUCTS_COLLECTION_ID,
                productId,
                {
                    offerStatus: 'pending',
                    status: 'offer-made',
                    latestOfferId: offer.$id,     // Set this to the new offer's ID
                    finalOfferId: '',             // Empty string for required string field
                }
            );

            return offer;
        } catch (error) {
            console.error('Error making offer:', error);
            throw error;
        }
    }
    // Get offers for a specific product
    async getProductOffers(productId) {
        try {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.OFFERS_COLLECTION_ID,
                [
                    Query.equal('productId', productId),
                    Query.orderDesc('$createdAt')
                ]
            );
            return response.documents;
        } catch (error) {
            console.error('Error fetching offers:', error);
            throw error;
        }
    };

    // Get user's products with offers
    async getUserProductsWithOffers(userId) {
        try {
            const products = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.PRODUCTS_COLLECTION_ID,
                [
                    Query.equal('userId', userId),
                    Query.orderDesc('$createdAt')
                ]
            );

            // Fetch offers for products with 'offer-made' status
            const productsWithOffers = await Promise.all(
                products.documents.map(async (product) => {
                    if (product.status === 'offer-made' && product.latestOfferId) {
                        const offer = await databases.getDocument(
                            appwriteConfig.databaseId,
                            appwriteConfig.OFFERS_COLLECTION_ID,
                            product.latestOfferId
                        );
                        return { ...product, latestOffer: offer };
                    }
                    return product;
                })
            );

            return productsWithOffers;
        } catch (error) {
            console.error('Error fetching user products with offers:', error);
            throw error;
        }
    };

    // Handle offer response (accept/decline)
    async handleOfferResponse(productId, offerId, accepted) {
        try {
            // Update offer status
            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.OFFERS_COLLECTION_ID,
                offerId,
                {
                    status: accepted ? 'accepted' : 'declined'
                }
            );

            // Update product status
            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.PRODUCTS_COLLECTION_ID,
                productId,
                {
                    status: accepted ? 'accepted' : 'active',
                    ...(accepted ? { finalOfferId: offerId } : {})
                }
            );

            return true;
        } catch (error) {
            console.error('Error handling offer response:', error);
            throw error;
        }
    };

    // Get all verified products for public display
    async getVerifiedProducts() {
        try {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.PRODUCTS_COLLECTION_ID,
                [
                    Query.equal('status', 'accepted'),
                    Query.orderDesc('$createdAt')
                ]
            );
            return response.documents;
        } catch (error) {
            console.error('Error fetching verified products:', error);
            throw error;
        }
    }
}


const client = new Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
    .setProject("679e4ef1002c91e8b897"); // Replace with your project ID

export const account = new Account(client);

export const appwriteService = new AppwriteService();
// Initialize Appwrite services
export const databases = new Databases(client);
export const storage = new Storage(client);
