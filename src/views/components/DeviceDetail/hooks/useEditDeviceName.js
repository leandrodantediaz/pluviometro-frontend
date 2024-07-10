import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CHANGE_DEVICE_NAME } from '../../../../data/graphQL/mutations/changeDeviceName/changeDeviceName';

const useEditDeviceName = (device) => {
  const [ isEditing, setIsEditing ] = useState(false);
  const [ pluviometerName, setPluviometerName ] = useState('');
  const [ temporalPluviometerName, setTemporalPluviometerName ] = useState('');
  const [ changeDeviceName, { loading: loadingChangeDeviceName } ] = useMutation(CHANGE_DEVICE_NAME);

  useEffect(() => {
    if (device) {
      setPluviometerName(device.name);
      setTemporalPluviometerName(device.name);
    }
  }, [ device ]);

  const handlePencilClick = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e) => {
    setTemporalPluviometerName(e.target.value);
  };

  const handleSaveEditPluviometerNameDialog = async () => {
    await changeDeviceName({
      variables: { deviceId: device.id, newName: temporalPluviometerName }
    });
    setPluviometerName(temporalPluviometerName);
    handleCloseEditPluviometerNameDialog();
  };

  const handleCloseEditPluviometerNameDialog = () => {
    setIsEditing(false);
  };

  return {
    isEditing,
    pluviometerName,
    temporalPluviometerName,
    loadingChangeDeviceName,
    handlePencilClick,
    handleNameChange,
    handleSaveEditPluviometerNameDialog,
    handleCloseEditPluviometerNameDialog
  };
};

export default useEditDeviceName;
