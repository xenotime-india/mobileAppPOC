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

export default class WorkshopDetails extends React.Component {
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
    const workshop = navigation.getParam('workshop', {});
    const {
      sfid,
      accessible,
      title,
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
    } = workshop || {};
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
                title={title}
                image={markerImg}
              />
            </MapView>
            <List>
              <ListItem>
                <Body>
                  <Text style={styles.label}>Workshop Name</Text>
                  <Text note style={styles.text}>
                    {title}
                  </Text>
                </Body>
              </ListItem>

              <ListItem>
                <Body>
                  <Text style={styles.label}>Workshop Duration</Text>
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
                    <Avatar source={primaryTeacherPic} />
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
                    <Avatar source={organizerPic} />
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
                    <Avatar source={coTeacher1Pic} />
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
                    <Avatar source={coTeacher2Pic} />
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
