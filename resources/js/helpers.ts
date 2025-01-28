export const arraysAreEqual = (arr1: any[], arr2: any[]) => {
    if (arr1.length !== arr2.length) return false;

    // Sort both arrays before comparison
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();

    return sortedArr1.every((value, index) => value === sortedArr2[index]);
};
