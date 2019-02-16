import React, { Component, PureComponent } from 'react';
import {
  Alert,
  Linking,
  Dimensions,
  LayoutAnimation,
  ActivityIndicator,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image
} from 'react-native';
import { Icon } from 'native-base';
import { BarCodeScanner, Permissions } from 'expo';
import BackImage from './../assets/images/Back-White.png';
import ScanSquare from './../assets/images/Scan-Square.png';
import { API } from '../constants';
import { secure_fetch } from '../services/api';

class StackedBarcodeOverlay extends PureComponent {
  render() {
    const {
      overlayIndex,
      message,
      messageType,
      closeMessageAction
    } = this.props;
    let messageIcon = '';
    switch (messageType) {
      case -1:
        messageIcon = (
          <>
            <Icon
              style={{ marginBottom: 10 }}
              name="close-circle"
              type="FontAwesome"
              style={{ fontSize: 40, color: '#ce0000' }}
            />
            <View style={{ marginTop: 25, marginBottom: 35 }}>
              <Text style={{ color: '#ce0000' }}>{message}</Text>
            </View>
          </>
        );
        break;
      case 1:
        messageIcon = (
          <>
            <Icon
              style={{ marginBottom: 10 }}
              name="information-circle-outline"
              type="FontAwesome"
              style={{ fontSize: 40, color: '#4b5487' }}
            />
            <View style={{ marginTop: 25, marginBottom: 35 }}>
              <Text style={{ color: '#4b5487' }}>{message}</Text>
            </View>
          </>
        );
        break;
      default:
        messageIcon = (
          <>
            <Icon
              style={{ marginBottom: 10 }}
              name="check-circle"
              type="FontAwesome"
              style={{ fontSize: 40, color: '#58B837' }}
            />
            <View style={{ marginTop: 25, marginBottom: 35 }}>
              <Text style={{ color: '#58B837' }}>{message}</Text>
            </View>
          </>
        );
        break;
    }
    return (
      <View style={[styles.modalWrapper, { zIndex: overlayIndex }]}>
        {messageIcon}

        <TouchableOpacity onPress={closeMessageAction} style={styles.btnStyle}>
          <Text style={styles.btnText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class LoadingOverlay extends PureComponent {
  render() {
    return (
      <View style={[styles.modalWrapper, { zIndex: 1 }]}>
        <ActivityIndicator size="large" animating color="#4b5487" />
        <Text style={{ color: '#58B837' }}>Validating...</Text>
      </View>
    );
  }
}

export default class QRCodeScanner extends Component {
  static navigationOptions = {
    title: 'Scanner',
    header: null
  };
  state = {
    hasCameraPermission: null,
    lastScanned: null,
    isScanning: false,
    showMessage: false,
    message: null,
    messageType: null
  };

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted'
    });
  };

  _closeMessageAction = () => {
    this.setState({ showMessage: false });
    this.resetScanner();
  };

  resetScanner = () => {
    setTimeout(() => {
      this.setState({
        isScanning: false,
        lastScanned: null
      });
    }, 1000);
  };

  _handleBarCodeRead = async result => {
    const { lastScanned, isScanning } = this.state;
    const { eventId, token } = this.props;
    if (result.data !== lastScanned && !isScanning) {
      try {
        LayoutAnimation.spring();
        this.setState({ lastScanned: result.data, isScanning: true });
        const payLoad = {
          eventId,
          attendeId: result.data
        };
        let results = await secure_fetch(`${API.REST.MARK_ATTENDANCE}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          accessToken: token,
          body: JSON.stringify(payLoad)
        });
        if (!results.ok) {
          throw new Error(results.statusText);
        }
        const { status, data, error } = await results.json();
        this.setState({
          message: error || data.message,
          showMessage: true,
          messageType: status === 200 ? 0 : 1
        });
      } catch (ex) {
        console.log(ex);
        this.setState({
          message: ex.message,
          showMessage: true,
          messageType: -1
        });
      }
    }
  };

  render() {
    const {
      barcodeModalVisible,
      setBarcodeModalVisible,
      scanModalTitle
    } = this.props;
    const { message, messageType, showMessage, isScanning } = this.state;
    return (
      <Modal
        animationType="fade"
        presentationStyle="fullScreen"
        transparent={false}
        visible={barcodeModalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#000000'
          }}
        >
          <View style={styles.container}>
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.drawerIcon}
                onPress={() => setBarcodeModalVisible(false)}
              >
                <Image
                  source={BackImage}
                  style={styles.backImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text style={styles.paragraph}>{scanModalTitle}</Text>
            </View>
            {this.state.hasCameraPermission === null ? (
              <Text>Requesting for camera permission</Text>
            ) : this.state.hasCameraPermission === false ? (
              <Text style={{ color: '#fff' }}>
                Camera permission is not granted
              </Text>
            ) : (
              <BarCodeScanner
                onBarCodeRead={this._handleBarCodeRead}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Image
              source={ScanSquare}
              style={{
                width: '50%',
                position: 'absolute',
                top: 'auto',
                bottom: 'auto',
                left: 'auto',
                right: 'auto'
              }}
              resizeMode="contain"
            />
            {showMessage && (
              <StackedBarcodeOverlay
                overlayIndex={1}
                message={message}
                messageType={messageType}
                closeMessageAction={this._closeMessageAction}
              />
            )}
            {isScanning && <LoadingOverlay />}

            {this._maybeRenderUrl()}

            <StatusBar hidden />
          </View>
        </View>
      </Modal>
    );
  }

  _maybeRenderUrl = () => {
    if (!this.state.lastScanned) {
      return;
    }

    return (
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.url}>
          <Text numberOfLines={1} style={styles.urlText}>
            {this.state.lastScanned}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={this.resetScanner}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000'
  },
  drawerIcon: {
    width: 30,
    height: 30,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paragraph: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    marginLeft: -30,
    zIndex: -1
  },
  containerView: {
    padding: 10,
    paddingTop: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    minHeight: 100
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    paddingTop: 35,
    flexDirection: 'row',
    zIndex: 2
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    flexDirection: 'row'
  },
  url: {
    flex: 1
  },
  urlText: {
    color: '#fff',
    fontSize: 20
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18
  },
  backImage: {
    height: 30,
    width: 30,
    zIndex: 2
  },
  modalWrapper: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 4,
    position: 'absolute'
  },
  barcodeNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5
  },
  btnStyle: {
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 2,
    backgroundColor: '#4b5487',
    paddingTop: 8,
    height: 36
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
