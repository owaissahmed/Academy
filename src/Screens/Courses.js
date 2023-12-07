import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
const devicewidth = Dimensions.get('window').width;
const deviceheight = Dimensions.get('window').height;
import FlashMessage, {showMessage} from 'react-native-flash-message';

const Accordion = ({id, title, Videos, Price, openAccordion, onToggle}) => {
  const [isConnected, setIsConnected] = useState(false);
  const navigation = useNavigation();
  const isOpen = openAccordion === id;

  const toggleAccordion = () => {
    onToggle(id);
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function Internet() {
    showMessage({
      message: '⚪️ No Internet Connection',
      // backgroundColor:'#36454F',
      type: 'danger',
      color: 'white',
      position: 'bottom',
      titleStyle: {
        fontSize: responsiveFontSize(2.25),
        lineHeight: responsiveHeight(3),
      },
      // duration: 5000,
    });
  }
  function CoursesForm() {
    if (isConnected == true) {
      navigation.navigate('Form');
    } else Internet();
  }

  return (
    <View>
      <TouchableOpacity onPress={toggleAccordion}>
        <View style={styles.TitleCollapse}>
          <Text allowFontScaling={false} style={styles.TitleText}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.Description_View}>
          <View style={styles.V_P_View}>
            <Text allowFontScaling={false} style={styles.DescriptionText}>
              {Videos}
            </Text>
            <Text allowFontScaling={false} style={styles.DescriptionText}>
              {Price}
            </Text>
          </View>
          <View style={styles.ButtonView}>
            <TouchableOpacity style={styles.Button}>
              <Text allowFontScaling={false} style={styles.ButtonText}>
                Demo Class
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Button} onPress={CoursesForm}>
              <Text allowFontScaling={false} style={styles.ButtonText}>
                Addmission
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const Courses = ({navigation}) => {
  const [openAccordion, setOpenAccordion] = useState(null);

  const handleToggle = accordionId => {
    setOpenAccordion(openAccordion === accordionId ? null : accordionId);
  };

  return (
    <ImageBackground
      resizeMode="cover"
      style={styles.background}
      source={require('../Images/background.jpg')}>
      <>
        <FlashMessage />
      </>
      <View>
        <Text allowFontScaling={false} style={styles.HeadingText}>
          COURSES
        </Text>
      </View>
      <ScrollView>
        <Accordion
          id={1}
          title="آسان  اصولِ  فقہ کورس  "
          Videos="Videos : 92"
          Price="Price : 7500"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={2}
          title="آسان  فہمِ  عقائد کورس"
          Videos="Videos : 28"
          Price="Price : 1500"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={3}
          title="آسان  شرح  مائۃ  عامل کورس"
          Videos="Videos : 29"
          Price="Price : 1500"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={4}
          title="آسان  فہمُ القرآن کورس"
          Videos="Videos : 51"
          Price="Price : 4500"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={5}
          title="آسان  تراکیبِ  نحویہ کورس"
          Videos="Videos : 46"
          Price="Price : 4500"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={6}
          title="تراکیبِ نحویہ کورس  پہلا پارہ"
          Videos="Videos : 24"
          Price="Price : 1500"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={7}
          title="دورۂ  صرف  و نحو"
          Videos="Videos : 44"
          Price="Price : 1500"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={8}
          title="دورۂ  منطق"
          Videos="Videos : 16"
          Price="Price : 1500"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={9}
          title="آسان  علمِ  صرف کورس"
          Videos="Videos : 35"
          Price="Price : 3000"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={10}
          title="آسان  علمِ  نحو کورس"
          Videos="Videos : 62"
          Price="Price : 7500"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={11}
          title="آسان  فہمِِ  بلاغت کورس (  علم المعانی  )"
          Videos="Videos : 74"
          Price="Price : 4500"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={12}
          title="آسان  مبادیاتِ   فقہ کورس"
          Videos="Videos : -"
          Price="Price : 3000"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={13}
          title="آسان  تدریسی  ٹیسٹ کورس"
          Videos="Videos : -"
          Price="Price : 3000"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={14}
          title="آسان  فہمِ وراثت کورس"
          Videos="Videos : -"
          Price="Price : 3000"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={15}
          title="آسان  اصولِ  حدیث کورس"
          Videos="Videos : -"
          Price="Price : 3000"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={16}
          title="آسان  فہمِِ  بلاغت کورس (  علم البیان والبدیع  )"
          Videos="Videos : 30"
          Price="Price : 3000"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={17}
          title="آسان  آدابِ  بحث  و مناظرہ کورس"
          Videos="Videos : 06"
          Price="Price : 500"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={18}
          title="حلِ  عبارت  و ترجمہ کورس"
          Videos="Videos : 30"
          Price="Price : 2000"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={19}
          title="اجراءُ  الصرف  فی  القرآن"
          Videos="Videos : 28"
          Price="Price : 3000"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={20}
          title="کتابُ  البیوع  قدوری  شریف"
          Videos="Videos : 52"
          Price="Price : 5000"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
    // alignItems: 'center',
    // justifyContent: 'space-evenly',
  },
  HeadingText: {
    fontFamily: 'good',
    color: '#2e4c60',
    // backgroundColor: 'seagreen',
    fontSize: responsiveFontSize(5),
    textAlign: 'center',
    // marginVertical:responsiveHeight(),
    marginTop: responsiveHeight(3),
    // marginBottom: responsiveHeight(2),
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  TitleCollapse: {
    alignItems: 'center',
    // paddingVertical: responsiveHeight(0.5),
    // paddingTop:responsiveHeight(0.25),
    paddingBottom: responsiveHeight(0.75),
    marginHorizontal: responsiveWidth(4),
    backgroundColor: '#2e4c60',
    marginVertical: responsiveHeight(2),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  TitleText: {
    color: '#fff',
    fontSize: responsiveScreenFontSize(3),
    fontFamily: 'mushaf',
    textAlignVertical: 'center',
  },
  Description_View: {
    padding: 10,
    marginHorizontal: responsiveWidth(4),
    backgroundColor: 'white',
    borderColor: '#2e4c60',
    borderWidth: 2,
    marginTop: responsiveHeight(-2),
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  V_P_View: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: responsiveWidth(1),
    borderRadius: 8,
  },
  DescriptionText: {
    color: '#2e4c60',
    fontSize: responsiveScreenFontSize(2.25),
    fontFamily: 'nunito',
    fontWeight: 'bold',
    letterSpacing: 0.25,
    marginVertical: responsiveHeight(0.25),
  },
  ButtonView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  Button: {
    marginTop: responsiveHeight(1),
    backgroundColor: '#2e4c60',
    paddingVertical: responsiveHeight(0.75),
    paddingHorizontal: responsiveWidth(3),
    borderRadius: 8,
  },
  ButtonText: {
    color: '#fff',
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'nunito',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default Courses;
