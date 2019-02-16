import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { MapView } from 'expo';
import {
  View,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';
import {
  Container,
  Content,
  List,
  Body,
  Icon,
  ListItem,
  Text,
  CheckBox,
  Fab,
  Button,
  Right
} from 'native-base';
import { attemptToOpenUrl } from '../../../utils';
import QRCodeScanner from '../../QRCodeScanner';
import Avatar from '../../../components/Avatar';
import moment from 'moment';
import markerImg from '../../../assets/images/map-pin.png';

const defaultPic =
  'data:image/png;base64,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';

export default class Details extends React.Component {
  state = {
    loading: false,
    data: [],
    page: 1,
    error: null,
    refreshing: false,
    barcodeModalVisible: false,
    currentModalTitle: 'Scan Attendee'
  };

  tConvert = time => {
    if (!time) {
      return '';
    }
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'am' : 'pm'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
      time[3] = ''; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  };

  setBarcodeModalVisible = visible => {
    this.setState({
      barcodeModalVisible: visible
    });
  };

  openMap = mapRegion => () => {
    const latlon = `${mapRegion.latitude},${mapRegion.longitude}`;
    const query = encodeURI('Santa Clara Marriott');
    const url =
      Platform.OS === 'ios'
        ? `maps://maps.apple.com/?ll=${latlon}&q=${query}`
        : `https://maps.google.com/?ll=${latlon}&q=${query}`;

    attemptToOpenUrl(url);
  };

  render() {
    const { navigation, screenProps } = this.props;
    const { user } = screenProps;
    const meetup = navigation.getParam('meetup', {});
    const {
      sfid,
      accessible,
      meetupTitle,
      meetupType,
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
      primaryTeacherName,
      organizerPic,
      organizerName,
      coTeacher1Pic,
      coTeacher1Name,
      coTeacher2Pic,
      coTeacher2Name,
      isActive,
      city,
      streetAddress1,
      streetAddress2
    } = meetup || {};
    const mapRegion = {
      latitude: meetupGeoLat,
      longitude: meetupGeoLon,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    };
    return (
      <View
        style={{
          flex: 1,
          borderWidth: 0,
          flexDirection: 'column'
        }}
      >
        <Container>
          <Content>
            <MapView initialRegion={mapRegion} style={styles.map}>
              <MapView.Marker
                coordinate={mapRegion}
                description={`${streetAddress1 || streetAddress2}, ${city}`}
                onCalloutPress={this.openMap(mapRegion)}
                ref={r => {
                  this._marker = r;
                }}
                title={meetupTitle}
                image={markerImg}
              />
            </MapView>
            <List>
              <ListItem>
                <Body>
                  <Text style={styles.label}>Meetup Name</Text>
                  <Text note style={styles.text}>
                    {meetupTitle}
                  </Text>
                </Body>
              </ListItem>
              <ListItem>
                <Body>
                  <Text style={styles.label}>Meetup Type</Text>
                  <Text note style={styles.text}>
                    {meetupType}
                  </Text>
                </Body>
              </ListItem>
              <ListItem>
                <Body>
                  <Text style={styles.label}>Meetup Duration</Text>
                  <Text note style={styles.text}>
                    {meetupDuration} Minutes
                  </Text>
                </Body>
              </ListItem>
              <ListItem>
                <Body>
                  <Text style={styles.label}>Is Active</Text>
                  <Icon
                    name={
                      isActive
                        ? 'checkmark-circle-outline'
                        : 'close-circle-outline'
                    }
                    style={{ color: '#4b5487', marginLeft: 10, fontSize: 20 }}
                  />
                </Body>
              </ListItem>
              <ListItem>
                <Body>
                  <Text style={styles.label}>Max Attendees</Text>
                  <Text note style={styles.text}>
                    {maxAttendees}
                  </Text>
                </Body>
              </ListItem>
              <ListItem>
                <Body>
                  <Text style={styles.label}>
                    Registration Start (Date/Time)
                  </Text>
                  <Text note style={styles.text}>
                    {registrationStartDateTime &&
                      moment.utc(registrationStartDateTime).format('MMM. D')}
                  </Text>
                </Body>
              </ListItem>
              <ListItem>
                <Body>
                  <Text style={styles.label}>Registration End (Date/Time)</Text>
                  <Text note style={styles.text}>
                    {registrationEndDateTime &&
                      moment.utc(registrationEndDateTime).format('MMM. D')}
                  </Text>
                </Body>
              </ListItem>
              <ListItem>
                <Body>
                  <Text style={styles.label}>Meetup Start Date</Text>
                  <Text note style={styles.text}>
                    {meetupStartDate &&
                      moment.utc(meetupStartDate).format('MMM. D')}
                  </Text>
                </Body>
              </ListItem>
              <ListItem>
                <Body>
                  <Text style={styles.label}>Meetup Start Time</Text>
                  <Text note style={styles.text}>
                    {this.tConvert(meetupStartTime)}
                  </Text>
                </Body>
              </ListItem>
              <ListItem>
                <Body>
                  <Text style={styles.label}>Primary Teacher</Text>
                  <Text note style={styles.text}>
                    {primaryTeacherName}
                  </Text>
                </Body>
                {primaryTeacherPic && (
                  <Right>
                    <Avatar source={{ uri: primaryTeacherPic }} />
                  </Right>
                )}
              </ListItem>
              <ListItem>
                <Body>
                  <Text style={styles.label}>Organizer</Text>
                  <Text note style={styles.text}>
                    {organizerName}
                  </Text>
                </Body>
                {organizerName && (
                  <Right>
                    <Avatar source={{ uri: organizerPic }} />
                  </Right>
                )}
              </ListItem>
              <ListItem>
                <Body>
                  <Text style={styles.label}>Co-Teacher 1</Text>
                  <Text note style={styles.text}>
                    {coTeacher1Name}
                  </Text>
                </Body>
                {coTeacher1Pic && (
                  <Right>
                    <Avatar source={{ uri: coTeacher1Pic }} />
                  </Right>
                )}
              </ListItem>
              <ListItem>
                <Body>
                  <Text style={styles.label}>Co-Teacher 2</Text>
                  <Text note style={styles.text}>
                    {coTeacher2Name}
                  </Text>
                </Body>
                {coTeacher2Name && (
                  <Right>
                    <Avatar source={{ uri: coTeacher2Pic }} />
                  </Right>
                )}
              </ListItem>
            </List>
          </Content>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{}}
            style={{ backgroundColor: '#4b5487' }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}
          >
            <Icon name="menu" />
            <Button
              style={{ backgroundColor: '#4b5487' }}
              onPress={() =>
                this.props.navigation.navigate('NewMeetup', { meetup })
              }
            >
              <Icon type="FontAwesome" name="edit" />
            </Button>
            <Button
              style={{ backgroundColor: '#4b5487' }}
              onPress={() => this.setState({ barcodeModalVisible: true })}
            >
              <Icon type="FontAwesome" name="qrcode" />
            </Button>
          </Fab>
        </Container>
        <QRCodeScanner
          barcodeModalVisible={this.state.barcodeModalVisible}
          setBarcodeModalVisible={this.setBarcodeModalVisible}
          scanModalTitle={this.state.currentModalTitle}
          token={user.token}
          eventId={sfid}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    height: 200,
    maxHeight: 200
  },
  label: {
    color: '#4b5487',
    fontSize: 14,
    lineHeight: 24
  },
  text: {
    color: '#4b5487',
    fontSize: 12,
    lineHeight: 14
  }
});
