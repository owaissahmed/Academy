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
import * as Animatable from 'react-native-animatable';
const Accordion = ({id, title, Detail, openAccordion, onToggle, Link}) => {
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

  const openInstagram = () => {
    const username = 'allama_azhar_ali_madani';
    const url = `https://www.instagram.com/${username}`;

    Linking.openURL(url)
      .then(data => {
        console.log('Instagram Opened: ', data);
      })
      .catch(() => {
        console.log('Error opening Instagram');
      });
  };

  const openFacebook = () => {
    const username = 'allamaazharalimadani';
    const url = `https://www.facebook.com/${username}`;

    Linking.openURL(url)
      .then(data => {
        console.log('Facebook Opened: ', data);
      })
      .catch(() => {
        console.log('Error opening Facebook');
      });
  };

  const openWhatsApp = () => {
    const phoneNumber = '1234567890';
    const url = `whatsapp://send?phone=${phoneNumber}`;

    Linking.openURL(url)
      .then(data => {
        console.log('WhatsApp Opened: ', data);
      })
      .catch(() => {
        console.log('Error opening WhatsApp');
      });
  };
  const openTelegram = () => {
    const username = 'Azharulislamacademy';
    const url = `https://t.me/${username}`;

    Linking.openURL(url)
      .then(data => {
        console.log('Telegram Opened: ', data);
      })
      .catch(() => {
        console.log('Error opening Telegram');
      });
  };

  return (
    <ImageBackground
      resizeMode="cover"
      style={styles.background}
      source={require('../Images/background.jpg')}>
      <View style={styles.submain}>
        <Animatable.View
          duration={2000}
          delay={100}
          animation="fadeInUp"
          style={styles.rectangle}>
          <Text allowFontScaling={false} style={styles.rectangletext}>
            ازھارالاسلام اکیڈمی
          </Text>
          <Text allowFontScaling={false} style={styles.rectangletext_}>
            آن لائن دینی تعلیم کا مستند ادارہ
          </Text>
        </Animatable.View>
      </View>
      <ScrollView>
      <Animatable.View animation={'fadeInUp'} delay={100} duration={2000}>
        <Accordion
          id={1}
          title="درسِ  نظامی  ہیلپ  ڈیسک"
          Detail="درس نظامی کے طلبہ اور اساتذہ کی درسی کتب سے متعلق مشکلات کے حل کے لیے مختلف اسباق کے یہ کلپس ریکارڈ کیے جاتے ہیں تاکہ سبق سمجھنا اور سمجھانا آسان ہو سکے اس لیے
          کلپس وائٹ بورڈ کی مدد سے ریکارڈ کیے جاتے ہیں جس میں آسان فہم انداز میں درسی کتب کی پیچیدہ ابحاث کو سمجھایا جاتا ہے درس نظامی اور عربی سبجیکٹ سے تعلق رکھنے والے طلبہ و اساتذہ کے لیے یہ انتہائی مفید سلسلہ ہے، اس میں ہر شخص کے لیے یہ اجازت ہے کہ وہ ہمیں اپنا مسئلہ پیش کرے ان شاء اللہ اس کا کلپ ریکارڈ کر کے گروپس میں بھیج دیا جائے گا ، یہ کلپس وٹس اپ ویڈیو ، یوٹیوب اور فیس بک پر وائرل کر دیے جاتے ہیں تاکہ جسے جہاں سے جیسے ضرورت ہو حاصل کر سکے"
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
          Detail="تشنگان علم کی سیرابی کے لیے ازھار الاسلام اکیڈمی نے آن لائن ٹیوشن سینٹر کا انعقاد کیا جس میں طلبہ اپنے اسباق اپنے ہم ذہن ٹیوٹر سے اپنی مرضی کے اوقات میں مکمل
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
        <Accordion
          id={9}
          title="ازھار الاسلام اکیڈمی  ویب  سائٹ"
          Detail="میڈیا کے اس تیز ترین دور میں پیغام رسائی کا ایک اہم ذریعہ ویب سائٹ بھی ہوتا ہے جہاں کثیر الجہات پلیٹ فارمز ایک پیج پر ڈسپلے ہوجاتے ہیں اور طالب اپنی خواہش و مرضی
        کے مطابق انتخاب کر سکتا ہے لہذا اسی تناظر میں اکیڈمی نے ویب سائٹ پر کام شروع کر دیا ہے جس میں اکیڈمی میں ہونے والے تمام امور (درس نظامی بیلپ ڈیسک ، آن  لائن شارٹ کورسز ، آن لائن درس نظامی، آن لائی ٹیوشن سینٹر ، ریکارڈڈ ویڈیو کورسز ، آن لائن تربیتی ورکشاپس، تحریری نوٹس، کتب) احسن انداز میں مرتب ہوں گے اور طالبین کے سہولت اور آسانی کا ذریعہ بنیں گے"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={10}
          title=" ازہار الاسلام اکیڈمی للبنات (آف لائن  )"
          Detail="خواتین اور بچیوں کو عموما ہمارے معاشرے میں میڈیا و سوشل میڈیا کی بے حیائیوں سے پریشان والدین موبائل اور انٹر نیٹ کے استعمال کو ممنوع قرار دے دیتے ہیں جس
        کے نتیجے میں وہ تعلیم سے محروم رہ جاتی ہے حالانکہ نسل نو کی تعمیر کی پہلی ذمہ داری انہی خواتین پر ہوتی ہے اسی لیے اکیڈمی نے ازہار الاسلام اکیڈمی للبنات (آف لائن) کا ارادہ
        کیا ہے اللہ نے چاہا تو عنقریب پہلی برانچ کا افتتاح کر دیا جائے گا، جہاں ناظرہ ، حفظ ، درس نظامی کے ساتھ ساتھ اکیڈمی میں چلنے والے والے آن لائن شارٹ
        کورسز آف لائن کروائے جائیں گے ، تربیتی ورک شاپس کا انعقاد ہو گا جس سے معاشرے میں خواتین کو وسیع النظری ، اخلاقیات اور عائلی ذمہ داریوں کی تربیت کی جائے گی"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={11}
          title="ازہار  الاسلام  ٹیوشن  نیٹورک  ( آف لائن  )"
          Detail="معاشرے میں دن بدن بڑھتے ہوئے کرائم والدین کو اپنے بچوں کے تحفظ کے بارے میں بہت پریشان کرتے ہیں بہت بڑا طبقہ اپنے بچوں کو اپنے گھر میں ہی دینی تعلیم سے آراستہ کرنا چاہتا ہے، لیکن غیر معیاری تعلیم اور غیر ذمہ دار افراد بچوں کو تعلیم کی بجائے ضیائع وقت کا سبب بنتے ہیں اکیڈمی نے ملک بھر سے اساتذہ کا ڈیٹا کلیکٹ کرنا شروع کر دیا ہے عنقریب سینئر ، ماہر با اعتماد نیچر آپ کے بچوں کو ڈور اسٹیپ پر تعلیم دیں گے جس سے تعلیمی معیار اور ذمہ استاد والدین اور بچوں کے لیے حصول دین کا ذریعہ بنیں گے"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        <Accordion
          id={12}
          title="ٹیچر   ٹریننگ   پروگرام"
          Detail="اساتذہ معمار قوم ہوتے ہیں قوم کا مستقبل ان کے رحم و کرم پر ہوتا ہے اگر غیر تربیت یافتہ مدرس مسند تدریس پر آجائے تو وہ نفع کی بجائے نقصان زیادہ کر نا شروع کر دیتا ہے خصوصا جب دینی تعلیم بالخصوص درس نظامی کا معلم ہو ، نئے معلمین کے تربیت کے لیے اکیڈمی ٹیچر ٹریننگ پروگرام کا آغاز کر رہی ہے جس میں ان شاء اللہ اساتذہ کو تربیت کرنے کے طریقے، طلبہ کی تعلیم میں بہتری اور خصوصا اسباق کا منھج اور پڑھانے کے دلچسپ طریقے سکھائے جائیں گے یہ پروگرام آن لائن بھی منعقد ہوگا ، از ہار الاسلام اکیڈمی میں آف لائن بھی ہوگا اور جو مدارس و جامعات اپنے اداروں میں اس کا انعقاد کریں گے وہاں جا کر بھی پروگرام منعقد کر دیا جائے گا"
          openAccordion={openAccordion}
          onToggle={handleToggle}
        />
        </Animatable.View>
      </ScrollView>
      <Animatable.View
        duration={2000}
        delay={100}
        animation="fadeInUp"
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: responsiveWidth(55),
          justifyContent: 'space-evenly',
          alignSelf: 'center',
          marginTop: responsiveHeight(2),
        }}>
        <TouchableOpacity onPress={openFacebook}>
          <Image
            style={{
              width: responsiveWidth(7.25),
              height: responsiveHeight(3.5),
            }}
            source={require('../Images/fb.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={openInstagram}>
          <Image
            style={{
              width: responsiveWidth(7.25),
              height: responsiveHeight(3.5),
            }}
            source={require('../Images/instagram.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={openWhatsApp}>
          <Image
            style={{
              width: responsiveWidth(7.25),
              height: responsiveHeight(3.5),
            }}
            source={require('../Images/whatsapp.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={openTelegram}>
          <Image
            style={{
              width: responsiveWidth(7.25),
              height: responsiveHeight(3.5),
            }}
            source={require('../Images/telegram.png')}
          />
        </TouchableOpacity>
      </Animatable.View>
      <Animatable.View
        duration={2000}
        delay={100}
        animation="fadeInUp"
        style={{
          marginTop: responsiveHeight(1),
          marginBottom: responsiveHeight(1),
          alignSelf: 'center',
        }}>
        <Text style={{color: '#2e4c60', fontWeight: 'bold'}}>CONTACT US</Text>
      </Animatable.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: devicewidth,
    height: deviceheight,
  },
  rectangletext: {
    fontFamily: 'mushaf',
    textTransform: 'uppercase',
    color: '#2e4c60',
    fontSize: responsiveFontSize(8.5),
    textAlign: 'center',
    // backgroundColor: 'lightblue',
    marginTop: responsiveHeight(-1.5),
  },
  rectangletext_: {
    fontFamily: 'mushaf',
    textTransform: 'uppercase',
    color: '#2e4c60',
    fontSize: responsiveFontSize(4.5),
    textAlign: 'center',
    marginTop: responsiveHeight(-3),
    marginBottom: responsiveHeight(1),
    // backgroundColor: 'lightgreen',
  },
  HeadingText: {
    fontFamily: 'mushaf',
    color: '#2e4c60',
    fontSize: responsiveFontSize(5),
    textAlign: 'center',
    marginTop: responsiveHeight(4),
    marginBottom: responsiveHeight(3),
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
    textAlign: 'center',
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
