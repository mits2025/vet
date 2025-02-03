import {CartItem} from "@/types";

export const arraysAreEqual = (arr1: any[], arr2: any[]) => {
    if (arr1.length !== arr2.length) return false;

    // Sort both arrays before comparison
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();

    return sortedArr1.every((value, index) => value === sortedArr2[index]);
}
export const productRoute = (item: CartItem) => {
    const params = new URLSearchParams();
    Object.entries(item.option_ids)
        .forEach(([typeId, optionId]) => {
            params.append(`options[${typeId}]`, optionId + '')
        })

    return route('product.show', item.slug) + '?' + params.toString();
}
