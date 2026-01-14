"use client";

const CurrentYear = () => {
  const currentYear = new Date().getFullYear();
  return <>{currentYear}</>;
}

export default CurrentYear