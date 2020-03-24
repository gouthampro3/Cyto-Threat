import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField, styled } from '@material-ui/core';
import { fieldToTextField } from 'formik-material-ui';

const StyledTextField = styled(TextField)({
  minWidth:200
})

const FormikAutocomplete = ({ textFieldProps, ...props }) => {

  const { form: { setTouched, setFieldValue } } = props;
  const { error, helperText, ...field } = fieldToTextField(props);
  const { name } = field;

  return (
    <Autocomplete
      {...props}
      {...field}
      onChange={ (_, value) => setFieldValue(name, value) }
      onBlur={ () => setTouched({ [name]: true }) }
      renderInput={ props => (
        <StyledTextField {...props} {...textFieldProps} helperText={helperText} error={error} />
      )}
    />
  );
}

export default FormikAutocomplete;