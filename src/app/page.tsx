"use client";
import React, { useState, useEffect } from "react";
import LoadingPage from "@/components/loadingPage";
import Dashboard from "@/app/dashboard/page"
import SignupForm from "@/app/signup/page"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    // Simulating loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingPage onLoadingComplete={handleLoadingComplete} />
      ) : (
        <section className="m-0 p-0">
          {/* <Dashboard /> */}
          <SignupForm />
        </section>
      )}
    </>
  );
}
