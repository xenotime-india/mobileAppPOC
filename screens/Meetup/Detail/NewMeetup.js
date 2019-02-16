import React, { Component } from 'react';
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
  Icon,
  Button,
  Text
} from 'native-base';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Dropdown } from 'react-native-material-dropdown';
import { TextField } from 'react-native-material-textfield';
import { View, Alert, Keyboard, LayoutAnimation } from 'react-native';
import DateTimePickerComponent from './../../../components/DateTimePickerComponent';
import AutoCompletePopup from './../../../components/AutoCompletePopup';
import { API } from '../../../constants';
import { secure_fetch } from '../../../services/api';

export default class NewMeetup extends Component {
  static navigationOptions = ({ navigate, navigation }) => ({
    headerTitle: ''
  });

  searchTeacher = async query => {
    const { user } = this.props.screenProps;

    try {
      const results = await secure_fetch(
        `${API.REST.GET_ALL_TEACHERS}?query=${query}`,
        {
          accessToken: user.token
        }
      );

      if (!results.ok) {
        throw new Error(results.statusText);
      }
      let result = await results.json();
      return result;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  validationSchema = Yup.object().shape({
    maxAttendees: Yup.number('Max Attendees Should be a number type.')
      .min(5, 'Minimum 5 Attendees allowed')
      .required('Max Attendees is required!'),
    registrationStartDateTime: Yup.date().required(
      'Start DateTime is required!'
    ),
    registrationEndDateTime: Yup.date().required('End DateTime is required!'),
    isActive: Yup.string().required('End DateTime is required!'),
    meetupMaster: Yup.string().required('Meetup Master is required!'),
    primaryTeacher: Yup.string().required('Primary Teacher is required!')
  });

  searchMeetupMaster = async query => {
    const { user } = this.props.screenProps;

    try {
      const results = await secure_fetch(
        `${API.REST.GET_ALL_MEETUP_MASTER}?query=${query}`,
        {
          accessToken: user.token
        }
      );

      if (!results.ok) {
        throw new Error(results.statusText);
      }
      let result = await results.json();
      return result;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  upsertMeetup = async values => {
    const { user } = this.props.screenProps;
    const { navigation } = this.props;
    const meetup = navigation.getParam('meetup', {});
    let payLoad = { ...values };
    if (meetup) {
      payLoad = { ...payLoad, sfid: meetup.sfid };
    }
    try {
      LayoutAnimation.spring();
      this.setState({ loading: true });

      let results = await secure_fetch(`${API.REST.UPSERT_MEETUP}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        accessToken: user.token,
        body: JSON.stringify(payLoad)
      });
      if (!results.ok) {
        throw new Error(results.statusText);
      }
      const { status, message } = await results.json();
      this.setState({
        loading: false,
        message,
        showMessage: true,
        messageType: status === 200 ? 0 : 1
      });
    } catch (ex) {
      console.log(ex);
      this.setState({
        loading: false,
        message: ex.message,
        showMessage: true,
        messageType: -1
      });
    }
  };
  render() {
    const { navigation } = this.props;
    const meetup = navigation.getParam('meetup', {});
    const {
      accessible,
      meetupTitle,
      meetupType,
      meetupMaster,
      meetupDuration,
      maxAttendees,
      registrationStartDateTime,
      registrationEndDateTime,
      description,
      teacherInfo,
      meetupStartDate,
      meetupGeoLat,
      meetupGeoLon,
      listPrice,
      unitPrice,
      alreadyRegisterdForMeetup,
      attendeeId,
      memberPrice,
      meetupStartTime,
      primaryTeacherPic,
      primaryTeacher,
      primaryTeacherName,
      organizer,
      organizerPic,
      organizerName,
      coTeacher1Pic,
      coTeacher1Name,
      coTeacher2Pic,
      coTeacher2Name,
      isActive
    } = meetup || {};

    return (
      <Container
        style={{
          margin: 10
        }}
      >
        <Content>
          <Formik
            initialValues={{
              meetupDuration,
              maxAttendees,
              registrationStartDateTime,
              registrationEndDateTime,
              isActive: isActive ? 'Yes' : 'No',
              meetupStartDate,
              meetupStartTime,
              meetupTitle,
              meetupMaster,
              primaryTeacher,
              primaryTeacherName,
              organizer,
              organizerName
            }}
            validationSchema={this.validationSchema}
            onSubmit={async values => {
              Alert.alert(JSON.stringify(values, null, 2));
              await this.upsertMeetup(values);
              Keyboard.dismiss();
            }}
          >
            {({
              values,
              touched,
              errors,
              dirty,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              handleReset,
              submitCount,
              setFieldValue
            }) => (
              <>
                <AutoCompletePopup
                  autoCorrect={false}
                  label="Meetup Master"
                  itemColor="#4b5487"
                  baseColor="#4b5487"
                  textColor="#4b5487"
                  fontSize={12}
                  labelFontSize={14}
                  value={values.meetupTitle}
                  onValueChange={({ label, value }) => {
                    setFieldValue('meetupMaster', value, false);
                    setFieldValue('meetupTitle', label, false);
                  }}
                  query={{
                    source: this.searchMeetupMaster,
                    labelField: 'name',
                    valueField: 'id'
                  }}
                  mode="lazy"
                  error={
                    errors.meetupMaster && touched.meetupMaster
                      ? errors.meetupMaster
                      : ''
                  }
                  formValues={values}
                  fieldName="meetupTitle"
                  isFormEditable
                  defaultValue=""
                  isFieldValueEditable
                  singleSelection
                />

                <Dropdown
                  autoCorrect={false}
                  label="Is Active"
                  data={[
                    {
                      value: 'Yes'
                    },
                    {
                      value: 'No'
                    }
                  ]}
                  itemColor="#4b5487"
                  baseColor="#4b5487"
                  textColor="#4b5487"
                  value={values.isActive}
                  fontSize={12}
                  labelFontSize={14}
                />
                <TextField
                  autoCorrect={false}
                  textColor="#4b5487"
                  tintColor="#4b5487"
                  baseColor="#4b5487"
                  labelFontSize={14}
                  fontSize={12}
                  error={
                    errors.maxAttendees && touched.maxAttendees
                      ? errors.maxAttendees
                      : ''
                  }
                  label="Max Attendees"
                  value={`${values.maxAttendees}`}
                  onChangeText={handleChange('maxAttendees')}
                />

                <DateTimePickerComponent
                  autoCorrect={false}
                  label="Registration Start (Date/Time)"
                  itemColor="#4b5487"
                  baseColor="#4b5487"
                  textColor="#4b5487"
                  fontSize={12}
                  mode="datetime"
                  labelFontSize={14}
                  value={values.registrationStartDateTime}
                  error={
                    errors.registrationStartDateTime &&
                    touched.registrationStartDateTime
                      ? errors.registrationStartDateTime
                      : ''
                  }
                  onChangeText={handleChange('registrationStartDateTime')}
                />
                <DateTimePickerComponent
                  autoCorrect={false}
                  label="Registration End (Date/Time)"
                  itemColor="#4b5487"
                  baseColor="#4b5487"
                  textColor="#4b5487"
                  fontSize={12}
                  mode="datetime"
                  labelFontSize={14}
                  value={values.registrationEndDateTime}
                  error={
                    errors.registrationEndDateTime &&
                    touched.registrationEndDateTime
                      ? errors.registrationEndDateTime
                      : ''
                  }
                  onChangeText={handleChange('registrationEndDateTime')}
                />
                <DateTimePickerComponent
                  label="Meetup Start Date"
                  itemColor="#4b5487"
                  baseColor="#4b5487"
                  textColor="#4b5487"
                  fontSize={12}
                  mode="date"
                  labelFontSize={14}
                  value={values.meetupStartDate}
                  error={
                    errors.meetupStartDate && touched.meetupStartDate
                      ? errors.meetupStartDate
                      : ''
                  }
                  onChangeText={handleChange('meetupStartDate')}
                />
                <DateTimePickerComponent
                  label="Meetup Start Time"
                  itemColor="#4b5487"
                  baseColor="#4b5487"
                  textColor="#4b5487"
                  fontSize={12}
                  mode="time"
                  labelFontSize={14}
                  value={values.meetupStartTime}
                  error={
                    errors.meetupStartTime && touched.meetupStartTime
                      ? errors.meetupStartTime
                      : ''
                  }
                  onChangeText={handleChange('meetupStartTime')}
                />
                <AutoCompletePopup
                  label="Organizer"
                  itemColor="#4b5487"
                  baseColor="#4b5487"
                  textColor="#4b5487"
                  fontSize={12}
                  labelFontSize={14}
                  value={values.organizerName}
                  error={
                    errors.organizer && touched.organizer
                      ? errors.organizer
                      : ''
                  }
                  onValueChange={({ label, value }) => {
                    setFieldValue('organizer', value, false);
                    setFieldValue('organizerName', label, false);
                  }}
                  query={{
                    source: this.searchTeacher,
                    labelField: 'name',
                    valueField: 'id'
                  }}
                  mode="lazy"
                  formValues={values}
                  fieldName="organizer"
                  isFormEditable
                  defaultValue=""
                  isFieldValueEditable
                  singleSelection
                />
                <AutoCompletePopup
                  label="Primary Teacher"
                  itemColor="#4b5487"
                  baseColor="#4b5487"
                  textColor="#4b5487"
                  fontSize={12}
                  labelFontSize={14}
                  value={values.primaryTeacherName}
                  error={
                    errors.primaryTeacher && touched.primaryTeacher
                      ? errors.primaryTeacher
                      : ''
                  }
                  onValueChange={({ label, value }) => {
                    setFieldValue('primaryTeacher', value, false);
                    setFieldValue('primaryTeacherName', label, false);
                  }}
                  query={{
                    source: this.searchTeacher,
                    labelField: 'name',
                    valueField: 'id'
                  }}
                  mode="lazy"
                  formValues={values}
                  fieldName="primaryTeacher"
                  isFormEditable
                  defaultValue=""
                  isFieldValueEditable
                  singleSelection
                />
                <View style={{ padding: 10 }}>
                  <Button
                    block
                    onPress={handleSubmit}
                    style={{ backgroundColor: '#4b5487' }}
                  >
                    <Text>Save</Text>
                  </Button>
                </View>
              </>
            )}
          </Formik>
        </Content>
      </Container>
    );
  }
}
