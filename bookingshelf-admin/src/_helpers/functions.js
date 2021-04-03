export const mapEmptyObjFields = (obj) => Object.keys(obj).reduce((values, key) => ({ ...values, [key]: obj[key] || null }), {});
export const CALCULATE_HEIGHT = (totalDuration, step, cellHeight, startTime) => {
    const totalStep = totalDuration / 300;
    startTime = startTime.split(":");
    const lastNumberTime = Number(startTime[1]);
    let missingStepAmount = 0;
    let heightResult;
    const minStep = 5;
    const intervalSteps = step / minStep;
    switch (step) {
        case 5:
            heightResult = (totalStep - intervalSteps) * cellHeight;
            break;
        case 10:
            if (lastNumberTime % step) {
                heightResult = (totalStep - intervalSteps + 1) * cellHeight / intervalSteps;
            } else {
                heightResult = (totalStep - intervalSteps) * cellHeight / intervalSteps;
            }
            break;
        case 15:
            missingStepAmount = lastNumberTime % step / minStep;
            heightResult = (totalStep + missingStepAmount - intervalSteps) * cellHeight / intervalSteps;
            break;
        case 30:
            missingStepAmount = lastNumberTime % step / minStep;
            heightResult = (totalStep + missingStepAmount - intervalSteps) * cellHeight / intervalSteps;
            break;
        default:
            heightResult = 0;
    }
    if (heightResult < 1) {
        return 0;
    }
    return heightResult;
}