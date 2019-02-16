import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { SearchBar, Card } from 'react-native-elements';
import moment from 'moment';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
  Item,
  Input,
  Icon
} from 'native-base';
import defaultConnector from '../../redux/connectors/defaultConnector';
import meetupthumb from './../../assets/images/meet-ups-pic-4.png';
import { API } from '../../constants';
import { secure_fetch } from '../../services/api';

class Meetup extends React.Component {
  static navigationOptions = ({ navigate, navigation }) => ({
    headerTitle: 'Meetups',
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('NewMeetup');
        }}
        style={{ marginRight: 10 }}
      >
        <Text style={{ color: '#ffffff' }}>New</Text>
      </TouchableOpacity>
    )
  });

  state = {
    loading: false,
    data: [],
    page: 1,
    seed: 1,
    error: null,
    refreshing: false,
    search: '',
    hasMore: true
  };

  async componentDidMount() {}

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

  updateSearch = search => {
    this.setState({ search });
  };

  makeRemoteRequest = async () => {
    const { user } = this.props.screenProps;

    const { page } = this.state;
    try {
      const results = await secure_fetch(
        `${API.REST.GET_MY_MEETUPS}&page=${page}&size=10`,
        {
          accessToken: user.token
        }
      );

      if (!results.ok) {
        throw new Error(results.statusText);
      }
      let { data } = await results.json();
      this.setState({
        data: page == 1 ? data : [...this.state.data, ...data],
        loading: false,
        refreshing: false,
        hasMore: data.length === 10
      });
    } catch (error) {
      console.log(error);
      this.setState({ error, loading: false });
    }
  };

  handleRefresh = async () => {
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true,
        hasMore: true
      },
      async () => {
        await this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = async () => {
    if (this.state.hasMore) {
      this.setState(
        {
          page: this.state.page + 1
        },
        async () => {
          await this.makeRemoteRequest();
        }
      );
    }
  };

  openDetail = item => () => {
    const { navigation } = this.props;
    navigation.navigate('MeetupDetail', { meetup: item });
  };

  renderHeader = () => {
    const { search } = this.state;
    return (
      <SearchBar
        placeholder="Search"
        lightTheme
        containerStyle={{
          backgroundColor: '#ffffff',
          borderWidth: 0
        }}
        inputContainerStyle={{ backgroundColor: '#f2f3f4' }}
        onChangeText={this.updateSearch}
        value={search}
      />
    );
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE'
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  getmeetupData = events =>
    events.filter(({ eventType }) => eventType === 'Meetup');

  render() {
    const { loading, refreshing } = this.state;
    const { event } = this.props.screenProps;
    const meetups = this.getmeetupData(event.data);
    return (
      <Container>
        {!loading && (
          <FlatList
            data={meetups}
            renderItem={({ item }) => {
              const {
                meetupTitle,
                meetupStartDate,
                city,
                streetAddress1,
                streetAddress2,
                meetupStartTime
              } = item || {};
              return (
                <ListItem thumbnail onPress={this.openDetail(item)}>
                  <Left>
                    <Thumbnail
                      square
                      source={meetupthumb}
                      style={{ borderRadius: 6 }}
                    />
                  </Left>
                  <Body>
                    <View>
                      <Text style={styles.date}>
                        {moment.utc(meetupStartDate).format('MMM. D')},{' '}
                        {this.tConvert(meetupStartTime)}
                      </Text>
                    </View>
                    <Text style={styles.textRight}>{meetupTitle}</Text>
                    <Text style={styles.textRightP} note numberOfLines={1}>
                      {streetAddress1 || streetAddress2}, {city}
                    </Text>
                  </Body>
                </ListItem>
              );
            }}
            keyExtractor={item => item.sfid}
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            onRefresh={this.handleRefresh}
            refreshing={refreshing}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={50}
          />
        )}
        {loading && (
          <Content
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 50
            }}
          >
            <ActivityIndicator size="large" color="#4b5487" />
          </Content>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#7b84b7'
  },
  textRight: {
    color: '#4b5487',
    fontSize: 14,
    lineHeight: 24
  },
  textRight: {
    color: '#4b5487',
    fontSize: 14,
    lineHeight: 24
  },
  textRightP: {
    color: '#4b5487',
    fontSize: 12,
    lineHeight: 16
  },
  date: {
    color: '#48a1db',
    fontSize: 12,
    lineHeight: 14,
    alignSelf: 'flex-end'
  }
});

export default Meetup;
