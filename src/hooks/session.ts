"use client";
export const fetchSession = async () => {
  try {
    const res = await fetch("/api/users/getPersonal", {
      method: "GET",
    });

    if (res.ok) {
      const data = await res.json();

      return data.user;
    } else {
      console.error("Failed to fetch session:", res.statusText);
    }
  } catch (error) {
    console.error("Error Sending Request:", error);
  }
};
