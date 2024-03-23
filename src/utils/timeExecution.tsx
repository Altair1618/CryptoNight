export default function formatExecutionTime(executionTime: number): string {
    // Convert milliseconds to minutes, seconds, and remaining milliseconds
    const minutes: number = Math.floor(executionTime / 60000);
    const seconds: number = Math.floor((executionTime % 60000) / 1000);
    const milliseconds: number = Math.floor(executionTime % 1000);

    // Build the formatted string
    let formattedTime: string = '';
    if (minutes > 0) {
        formattedTime += `${minutes} minute${minutes > 1 ? 's' : ''}, `;
    }
    if (seconds > 0) {
        formattedTime += `${seconds} second${seconds > 1 ? 's' : ''}, `;
    }
    formattedTime += `${milliseconds} millisecond${milliseconds > 1 ? 's' : ''}`;

    return formattedTime;
}