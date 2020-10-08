import React from 'react';
import { View } from 'react-native';
import PageHeader from '../../components/PageHeader';
import styles from './styles';

// import { Container } from './styles';

const TeacherList: React.FC = () => {
  return (
    <View style={styles.container}>
      <PageHeader title='Proffys disponiveis'/>
    </View>
    
    );
}

export default TeacherList;