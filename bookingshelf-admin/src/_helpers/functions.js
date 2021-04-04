export const mapEmptyObjFields = (obj) => Object.keys(obj).reduce((values, key) => ({ ...values, [key]: obj[key] || null }), {});
export const calculateNotesHeight  = (totalDuration, step, cellHeight, startTime) => {
    const totalStep = totalDuration / 300;
    const lastNumberTime = Number(startTime.split(":")[1]);
    let heightResult;
    const minStep = 5;
    const intervalSteps = step / minStep;
    const missingStepAmount = lastNumberTime % step / minStep;
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
            heightResult = (totalStep + missingStepAmount - intervalSteps) * cellHeight / intervalSteps;
            break;
        case 30:
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