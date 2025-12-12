export  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG");
};