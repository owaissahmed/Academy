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

const PendingProjects = ({navigation}) => {
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
        مستقبل  قریب  کے  منصوبے
        </Text>
      </View>
      <ScrollView>
        <Accordion
          id={1}
          title="ازھار الاسلام اکیڈمی  ویب  سائٹ"
          Detail="میڈیا کے اس تیز ترین دور میں پیغام رسائی کا ایک اہم ذریعہ ویب سائٹ بھی ہوتا ہے جہاں کثیر الجہات پلیٹ فارمز ایک پیج پر ڈسپلے ہوجاتے ہیں اور طالب اپنی خواہش و مرضی
          کے مطابق انتخاب کر سکتا ہے لہذا اسی تناظر میں اکیڈمی نے ویب سائٹ پر کام شروع کر دیا ہے جس میں اکیڈمی میں ہونے والے تمام امور (درس نظامی بیلپ ڈیسک ، آن  لائن شارٹ کورسز ، آن لائن درس نظامی، آن لائی ٹیوشن سینٹر ، ریکارڈڈ ویڈیو کورسز ، آن لائن تربیتی ورکشاپس، تحریری نوٹس، کتب) احسن انداز میں مرتب ہوں گے اور طالبین کے سہولت اور آسانی کا ذریعہ بنیں گے"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={2}
          title=" ازہار الاسلام اکیڈمی للبنات (آف لائن)"
          Detail="خواتین اور بچیوں کو عموما ہمارے معاشرے میں میڈیا و سوشل میڈیا کی بے حیائیوں سے پریشان والدین موبائل اور انٹر نیٹ کے استعمال کو ممنوع قرار دے دیتے ہیں جس
          کے نتیجے میں وہ تعلیم سے محروم رہ جاتی ہے حالانکہ نسل نو کی تعمیر کی پہلی ذمہ داری انہی خواتین پر ہوتی ہے اسی لیے اکیڈمی نے ازہار الاسلام اکیڈمی للبنات (آف لائن) کا ارادہ
          کیا ہے اللہ نے چاہا تو عنقریب پہلی برانچ کا افتتاح کر دیا جائے گا، جہاں ناظرہ ، حفظ ، درس نظامی کے ساتھ ساتھ اکیڈمی میں چلنے والے والے آن لائن شارٹ
          کورسز آف لائن کروائے جائیں گے ، تربیتی ورک شاپس کا انعقاد ہو گا جس سے معاشرے میں خواتین کو وسیع النظری ، اخلاقیات اور عائلی ذمہ داریوں کی تربیت کی جائے گی"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={3}
          title=" ازہار  الاسلام  ٹیوشن  نیٹورک  ( آف لائن )"
          Detail="معاشرے میں دن بدن بڑھتے ہوئے کرائم والدین کو اپنے بچوں کے تحفظ کے بارے میں بہت پریشان کرتے ہیں بہت بڑا طبقہ اپنے بچوں کو اپنے گھر میں ہی دینی تعلیم سے آراستہ کرنا چاہتا ہے، لیکن غیر معیاری تعلیم اور غیر ذمہ دار افراد بچوں کو تعلیم کی بجائے ضیائع وقت کا سبب بنتے ہیں اکیڈمی نے ملک بھر سے اساتذہ کا ڈیٹا کلیکٹ کرنا شروع کر دیا ہے عنقریب سینئر ، ماہر با اعتماد نیچر آپ کے بچوں کو ڈور اسٹیپ پر تعلیم دیں گے جس سے تعلیمی معیار اور ذمہ استاد والدین اور بچوں کے لیے حصول دین کا ذریعہ بنیں گے"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={4}
          title="ٹیچر   ٹریننگ   پروگرام"
          Detail="اساتذہ معمار قوم ہوتے ہیں قوم کا مستقبل ان کے رحم و کرم پر ہوتا ہے اگر غیر تربیت یافتہ مدرس مسند تدریس پر آجائے تو وہ نفع کی بجائے نقصان زیادہ کر نا شروع کر دیتا ہے خصوصا جب دینی تعلیم بالخصوص درس نظامی کا معلم ہو ، نئے معلمین کے تربیت کے لیے اکیڈمی ٹیچر ٹریننگ پروگرام کا آغاز کر رہی ہے جس میں ان شاء اللہ اساتذہ کو تربیت کرنے کے طریقے، طلبہ کی تعلیم میں بہتری اور خصوصا اسباق کا منبج اور پڑھانے کے دلچسپ طریقے سکھائے جائیں گے یہ پروگرام آن لائن بھی منعقد ہوگا ، از ہار الاسلام اکیڈمی میں آف لائن بھی ہوگا اور جو مدارس و جامعات اپنے اداروں میں اس کا انعقاد کریں گے وہاں جا کر بھی پروگرام منعقد کر دیا جائے گا"
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
  },
  HeadingText: {
    fontFamily: 'mushaf',
    color: '#2e4c60',
    fontSize: responsiveFontSize(5.75),
    textAlign: 'center',
    marginTop: responsiveHeight(4),
    marginBottom: responsiveHeight(2),
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  TitleCollapse: {
    alignItems: 'center',
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
    fontWeight: '600',
    letterSpacing: 0.25,
    marginVertical: responsiveHeight(0.25),
    textAlign:'center',
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

export default PendingProjects;
