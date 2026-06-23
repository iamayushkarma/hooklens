const formatDate = (dateString: Date) => {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

export { formatDate };
