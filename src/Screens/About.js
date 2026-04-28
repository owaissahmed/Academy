import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CompletedProject = () => {
  return (
    <View style={styles.container}>
      <View style={{ position: "absolute", top: -(30), left: -(50), right: -(50), height: "40%", backgroundColor: '#0F5C5C', borderBottomLeftRadius: (180), borderBottomRightRadius: (180), }} />

      {/* HEADER */}
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <View style={styles.loginBox}>
            <Text style={styles.loginText}>Admin</Text>
          </View>

          <View style={styles.loginBox}>
            <Text style={styles.loginText}>Teacher</Text>
          </View>
        </View>

        <Text style={styles.title}>ازہار الاسلام اکیڈمی</Text>
        <Text style={styles.subtitle}>
          آن لائن دینی تعلیم کا مستند ادارہ
        </Text>
      </View>

      {/* CONTENT (empty for now) */}
      <View style={{ flex: 1 }} />

      {/* FOOTER */}
      <View style={styles.footerContainer}>
        <View style={styles.item}>
          <Text style={styles.icon}>🏠</Text>
          <Text style={styles.text}>Home</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.icon}>🔔</Text>
          <Text style={styles.text}>Notifications</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.icon}>📞</Text>
          <Text style={styles.text}>Contact</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.icon}>👤</Text>
          <Text style={styles.text}>Profile</Text>
        </View>
      </View>

    </View>
  );
};

export default CompletedProject;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  /* HEADER */
  headerContainer: {
    backgroundColor: '#0F5C5C',
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
  },
  topRow: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 40,
  },
  loginBox: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  loginText: {
    fontSize: 12,
    color: '#333',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 30,
  },
  subtitle: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },

  /* FOOTER */
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0F5C5C',
    paddingVertical: 12,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  item: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});