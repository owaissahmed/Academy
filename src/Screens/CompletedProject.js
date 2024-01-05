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
    Alert.alert('⚫ Warning', 'No Internet Connection!');
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
          Detail="درس نظامی کے طلبہ اور اساتذہ کی درسی کتب سے متعلق مشکلات کے حل کے لیے مختلف اسباق کے یہ کلپس ریکارڈ کیے جاتے ہیں تاکہ سبق سمجھنا اور سمجھانا آسان ہو سکے اس لیے
          کلپس وائٹ بورڈ کی مدد سے ریکارڈ کیے جاتے ہیں جس میں آسان فہم انداز میں درسی کتب کی پیچیدہ ابحاث کو سمجھایا جاتا ہے درس نظامی اور عربی سبجیکٹ سے تعلق رکھنے والے طلبہ و اساتذہ کے لیے  یہاں پر سلسلہ ہے، اس میں ہر شخص کے لیے یہ اجازت ہے کہ وہ ہمیں اپنا مسئلہ پیش کرے ان شاء اللہ اس کا کلپ ریکارڈ کر کے گروپس میں بھیج دیا جائے گا ، یہ کلپس وٹس اپ ویڈیو ، یوٹیوب اور فیس بک پر وائرل کر دیے جاتے ہیں تاکہ جسے جہاں سے جیسے ضرورت ہو حاصل کر سکے"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={2}
          title="آن  لائن  شارٹ  کورسز"
          Detail="درس نظامی کے طلبہ اور اساتذہ کے علمی رسوخ کے لیے مختلف اوقات میں شارٹ کورسز کا انعقاد کیا جاتا ہے جس میں مختلف فنون و علوم کو آسان فہم انداز میں طلبہ کو سکھایا جاتا ہے یہ کورسز طلبہ میں علمی قابلیت و مہارت پیدا کرنے کے لیے اپنی پہچان خود ہیں ، ان کورسز میں صرف و نحو، بلاغت و منطق ، فقہ واصول فقہ ، فہم عبارت و گرامر ، اصول
          حدیث مکمل کیے جاچکے ہیں ، مزید فنون پر سلسلہ تاحال جاری ہے"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={3}
          title="آن  لائن  درسِ  نظامی"
          Detail="ملک و بیرون ملک کے شائقین علم طلبہ کے لیے باقاعدہ درس نظامی کا اغاز ہوچکا ہے  جس میں کنز المدارس بورڈ (دعوت اسلامی) کے نصاب کے مطابق 8 سالہ عالم کورس کروایا جائے
           گا، ممکنہ حد تک کنزالمدارس سے پیپر بھی دلوائے جائیں گے اور اکیڈمی اپنی سند کااجراء بھی کرے گی ان شاء الله الکریم" 
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={4}
          title="آن  لائن  ٹیویشن  سنٹر"
          Detail="تشنگان علم کی سیرابی کے لیے ازھار الاسلام اکیڈمی نے آن لائن پر ٹیوشن سینٹر کا انعقاد کیا جس میں طلبہ اپنے اسباق اپنے ہم ذہن ٹیوٹر سے اپنی مرضی کے اوقات میں مکمل
          کرتے ہیں ، اس وقت ادارے کے تحت 15 میل و فی میل اساتذہ تعلیمی و تدریسی خدمات سر انجام دے رہے ہیں"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={5}
          title="ریکارڈڈ  ویڈیو  کورسز"
          Detail="جو طلبہ اکیڈمی کی لائیو کلاسز کسی مجبوری کی بنا پر نہیں لے سکتے ان کی سہولت کے لیے اکیڈمی نے ریکارڈ کورسز کا سلسلہ رکھا ہے جس میں درس نظامی کے طلبہ اور اساتذہ کے علمی رسوخ کے لیے مختلف فنون و علوم کو آسان فہم انداز میں ویڈیو کلاسز کے ذریعے سکھایا جاتا ہے، ان کورسز کا دورانیہ دو، تین اور چھ ماہ تک ہوتا ہے"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={6}
          title="آن  لائن  تعلیمی  ورکشاپ"
          Detail="مختلف مواقع اور اہم امور کے سلسلے میں تربیتی ورکشاپ کا اہتمام کیا جاتا ہے جو          یوٹیوب چینل اور زوم ایپ کے ذریعے نشر ہوتا ہے جس میں علمی ترقی ، راہ علم کی رکاوٹیں اور علماء
          کی ذمہ داریاں، معاشرتی واخلاقی پہلووں پر خصوصی توجہ دی جاتی ہے"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={7}
          title="تحریری  نوٹس"
          Detail="بہت سے طلبہ ویڈیو اور آڈیو کی بجائے تحریری منبع کو پسند کرتے ہیں ان کے  لیے تحریر کے ذریعے حصول علم آسان اور مفید ہوتا ہے ایسے طلبہ کی سہولت کے لیے اکیڈمی نے مختلف
          فنون و اسباق کے نوٹس تیار کیے ہیں جن کے ذریعے تشنگان علم کی سیرابی کا سامان ہوتا ہے"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={8}
          title="کتب"
          Detail="ادارے کے تحت تحریر و تصنیف کا کام بھی جاری ہے جس میں کتب ورسائل پر کام جاری ہے ایک کتاب بنام ازبار النحو  پبلش ہو کر مارکیٹ میں آچکی ہے جبکہ آسان اصول فقہ، آسان فہم عقائد اور مختلف کتب پر حواشی کا سلسلہ ہے عنقریب یہ کتب بھی منظر عام پر آجائیں گی    ان شاء اللہ"
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
    marginTop: responsiveHeight(4),
    marginBottom: responsiveHeight(3),
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  TitleCollapse: {
    // justifyContent:'center',
    alignItems: 'center',
    // paddingVertical: responsiveHeight(0.5),
    // paddingTop:responsiveHeight(0.25),
    paddingBottom: responsiveHeight(0.75),
    marginHorizontal: responsiveWidth(4),
    backgroundColor: '#2e4c60',
    marginVertical: responsiveHeight(2),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // marginTop:re
    // backgroundColor:'red'
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
