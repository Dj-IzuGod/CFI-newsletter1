// Verify SweetAlert2 is loaded
if (typeof Swal === "undefined") {
  console.error("SweetAlert2 not loaded!");
}

alert("it is working");

document
  .getElementById("newsletter-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Form submission started");

    try {
      const formData = new FormData(e.target);
      const response = await fetch("/", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);

      if (!response.ok) throw new Error("Server error");

      const result = await response.json();
      console.log("Result:", result);

      // Simple test alert
      await Swal.fire({
        title: "Test",
        text: "If you see this, SweetAlert2 works!",
        icon: "success",
      });

      // Your actual success popup
      await Swal.fire({
        title: result.isUpdate ? "Updated!" : "Subscribed!",
        text: `${result.email} was ${result.isUpdate ? "updated" : "added"}`,
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      console.error("Error:", error);
      await Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  });
