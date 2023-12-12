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
  Linking,
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

const Accordion = ({
  id,
  title,
  Detail,
  openAccordion,
  onToggle,
  Link,
}) => {
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

  const CoursesForm = () => {
    if (isConnected == false) {
      Internet();
    } else navigation.navigate('Form', {TextHomeTuition: title});
  };

  function Internet() {
    Alert.alert('⚫ Warning', 'No INternet Connection!');
  }

  function Demo() {
    if (isConnected == true) {
      Linking.openURL(Link);
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
              {Detail}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const CompletedProject = ({navigation}) => {
  const [openAccordion, setOpenAccordion] = useState(null);

  const handleToggle = accordionId => {
    setOpenAccordion(openAccordion === accordionId ? null : accordionId);
  };

  return (
    <ImageBackground
      resizeMode="cover"
      style={styles.background}
      source={require('../Images/background.jpg')}>
      <View>
        <Text allowFontScaling={false} style={styles.HeadingText}>
          پایہ تکمیل تک پہنچنے والے منصوبے
        </Text>
      </View>
      <ScrollView>
        <Accordion
          id={1}
          title="درسِ  نظامی  ہیلپ  ڈیسک"
          Detail="درس نظامی کے طلبہ اور اساتذہ کی درسی کتب سے متعلق مشکلات کے حل کے لیے مختلف اسباق کے شارٹ کلپس ریکارڈ کیے جاتے ہیں تاکہ سبق سمجھنا اور سمجھانا آسان ہو سکے اس لیے
          کلپس وائٹ بورڈ کی مدد سے ریکارڈ کیے جاتے ہیں جس میں آسان فہم انداز میں درسی کتب کی پیچیدہ ابحاث کو سمجھایا جاتا ہے درس نظامی اور عربی سبجیکٹ سے تعلق رکھنے والے طلبہ و اسائندہ کے لیے  یہاں پر سلسلہ ہے، اس میں ہر شخص کے لیے یہ اجازت ہے کہ وہ ہمیں اپنا مسئلہ پیش کرے ہم ان شاء اللہ اس کا کلپ ریکارڈ کر کے گروپس میں بھیج دیں گے ، یہ کلپس وٹس اپ ویڈیو ، یوٹیوب اور فیس بک پر وائرل کر دیے جاتے ہیں تاکہ جسے جہاں سے جسے ضرورت ہو حاصل کر سکے"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={2}
          title="آن  لائن  شارٹ  کورسز"
          Detail="Detail : 28"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={3}
          title="آن  لائن  ملٹری  کورس"
          Detail="Detail : 29"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={4}
          title="آن  لائن  ٹیویشن  سنٹر"
          Detail="Detail : 51"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={5}
          title="ریکارڈڈ  ویڈیو  کورسز"
          Detail="Detail : 46"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={6}
          title="آن  لائن  تعلیمی  ورکشاپ"
          Detail="Detail : 24"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={7}
          title="تحریری  نوٹس"
          Detail="Detail : 44"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={8}
          title="کتب"
          Detail="Detail : 16"
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
    fontFamily: 'mushaf',
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
    marginTop: responsiveHeight(-2.25),
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
    // fontFamily: 'mushaf',
    fontWeight: '600',
    letterSpacing: 0.25,
    marginVertical: responsiveHeight(0.25),
    textAlign:'center',
    // fontFamily: 'mushaf',
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

export default CompletedProject;
