/**
 * Display an error message to the HTML Element with id "error".
 * @param msg message
 */
export function showError(msg: string = "No Data"): void {
    const container = document.getElementById("error");
    if(container === null) return console.log("No Element with ID: error");
    const element = document.createElement('p');
    element.innerText = msg;
    container.appendChild(element);
    console.log(msg);
}

/**
 * Convert from degrees to radiant
 * @param angle
 * @returns angle to radiant
 */
export function toRadian(angle: number): number {
    return angle * Math.PI / 180;
}

