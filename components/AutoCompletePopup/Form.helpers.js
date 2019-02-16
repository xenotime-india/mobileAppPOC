export function haveDependentFormValuesChanged(
  dependentFormValues = [],
  prevProps,
  nextProps
) {
  let changedValues = dependentFormValues.map(fieldName => {
    let fieldExists = prevProps.formValues[fieldName];
    let fieldCreated = !fieldExists && nextProps.formValues[fieldName];
    let fieldValueChanged = false;
    if (fieldExists) {
      switch (typeof prevProps.formValues[fieldName]) {
        case 'string':
          fieldValueChanged =
            prevProps.formValues[fieldName] !== nextProps.formValues[fieldName];
          break;
        case 'object':
          fieldValueChanged =
            prevProps.formValues[fieldName] &&
            prevProps.formValues[fieldName].value &&
            nextProps.formValues[fieldName] &&
            nextProps.formValues[fieldName].value
              ? prevProps.formValues[fieldName].value !==
                nextProps.formValues[fieldName].value
              : false;
          break;
      }
    }
    return fieldCreated || fieldValueChanged;
  });

  return changedValues.some(hasChanged => hasChanged);
}
