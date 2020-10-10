import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput  } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import {Feather}from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage'

import PageHeader from '../../components/PageHeader';
import TeacherItem, { ITeacher } from '../../components/TeacherItem';
import styles from './styles';
import api from '../../services/api';


// import { Container } from './styles';

const TeacherList: React.FC = () => {
  const [favorites, setFavorites ] = useState<number[]>([])
  const [isFilteresVisible, setIsFilteresVisible ] = useState(false)
  const [teachers,setTeachers] = useState([])
  const [subject,setSubject] = useState('')
  const [week_day,setWeekDay] = useState('')
  const [time,setTime] = useState('')

  function loadFavorites(){
    AsyncStorage.getItem('favorites').then(response=>{
      if(response){
        const favoritedTeachers = JSON.parse(response)
        const favoritedTeachersIds = favoritedTeachers.map((teacher:ITeacher)=>{
          return teacher.id
        })
        setFavorites(favoritedTeachersIds)
      }
    })
  }

  // useEffect(()=>{
  //   loadFavorites();
  // },[])

   async function handleFiltersSubmit(){
     loadFavorites();
   const response = await api.get('/classes',{
        params:{
          subject,
          week_day,
          time
        }
    })
    setIsFilteresVisible(false)
    setTeachers(response.data)
  }

  function headerToggleFilteresVisible(){
    setIsFilteresVisible(!isFilteresVisible)
  }

  return (
    <View style={styles.container}>
      <PageHeader 
        title='Proffys disponiveis' 
        headerRight={(
          <BorderlessButton onPress={headerToggleFilteresVisible}>
            <Feather name='filter' size={25} color='#fff'/>
          </BorderlessButton>
        )}
        >
        { isFilteresVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label} >Máteria</Text>
            <TextInput 
              style={styles.input}
              placeholder="qual a materias"
              placeholderTextColor='#c1bccc'
              value={subject} 
              onChangeText={text=> setSubject(text)}

            />
            <View style={styles.inputGrup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label} >Dia da semana</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Qual o dia?"
                  placeholderTextColor='#c1bccc'
                  value={week_day} 
                  onChangeText={text=> setWeekDay(text)}
                />
              </View>
              <View style={styles.inputBlock}>
                <Text style={styles.label} >Horario</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Qual horario?"
                  placeholderTextColor='#c1bccc'
                  value={time}
                  onChangeText={text=> setTime(text)}
                />
              </View>
              </View>
              <RectButton onPress={handleFiltersSubmit} style={styles.submitButton} >
                <Text style={styles.submitButtonText}>Filtar</Text>
              </RectButton>
          </View>
        )}
        
      </PageHeader>
      <ScrollView 
        style={styles.teacherList} 
        contentContainerStyle={{
          paddingHorizontal:16,
          paddingBottom:16,
        }}
        >
        {teachers.map((teacher:ITeacher)=>{
          return(
            <TeacherItem 
              key={teacher.id} 
              teacher={teacher}
              favorited={favorites.includes(teacher.id)}
              />
          )
        })}
      </ScrollView>
      
    </View>
    
    );
}

export default TeacherList;