import React, {useState} from 'react';
import { Image, View,  Text, Linking } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage'

import HeartOutlineIcon from '../../assets/images/icons/heart-outline.png';
import unFavoriteIcon from '../../assets/images/icons/unfavorite.png';
import whatsappIcon from '../../assets/images/icons/whatsapp.png'
import  styles  from './styles';
import api from '../../services/api';

export interface ITeacher{
    id: number,
    subject: String,
    cost: Number,
    name: String,
    avatar: string,
    whatsapp: String,
    bio: String
}
 interface TeacherItemPropos{
    teacher: ITeacher,
    favorited: boolean,
}

const TeacherItem: React.FC<TeacherItemPropos> = ({teacher, favorited}) => {
    const [isFavorited, setIsFavorited ] = useState(favorited);
    function handleLinkToWhatsapp(){
        api.post('/connections',{
            user_id: teacher.id
        })
        Linking.openURL(`whatsapp://send?text=Vim atravez do app proffy!&phone=+${teacher.whatsapp}`)
    }
     async function headerToggleFavorite(){
        try {
            const favorites = await AsyncStorage.getItem('favorites')
            let favoritesArray=[]
            if(favorites){
                favoritesArray = JSON.parse(favorites);
            }

            if (isFavorited) {
                //remover dos favoritos 
                const favoriteIndex =favoritesArray.findIndex((teacherItem:ITeacher)=>{
                    return teacherItem.id === teacher.id
                })
                favoritesArray.slice(favoriteIndex, 1)
                setIsFavorited(false);
            } else {
                // adicionar nos favoritos
                favoritesArray.push(teacher)
                setIsFavorited(true);
                
            }

            await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
        } catch (error) {
            console.log(error);
            
        }
    }
  return (
        <View style={styles.container} >
            <View style={styles.profile}>
                <Image 
                    style={styles.avatar}
                    source={{uri: teacher.avatar}}
                />

                <View style={styles.profileInfo}>
                    <Text style={styles.name} >{teacher.name} </Text>

                    <Text style ={styles.subject}>{teacher.subject}</Text>
                </View>
                
            </View>

            <Text style={styles.bio} >{teacher.bio} </Text>
            <View style={styles.footer}>
                <Text style={styles.price} >
                    Preço/hora{'   '}
                    <Text style={styles.priceValue} >R${teacher.cost} </Text>
                </Text>
                <View style={styles.buttonsContainer}>
                    <RectButton 
                        onPress={headerToggleFavorite}
                        style={[ 
                            styles.favoriteButton,
                           isFavorited ?styles.favorited: {}
                        ]}
                    >
                        {isFavorited
                            ?<Image source={unFavoriteIcon}/>
                            :<Image source={HeartOutlineIcon}/>
                         }
                        
                        
                    </RectButton>
                    <RectButton onPress={handleLinkToWhatsapp} style={styles.contactButton}>
                        <Image source={whatsappIcon}/>
                        <Text style={styles.contactButtonText}>Entrar em contato</Text>
                    </RectButton>
                </View>
            </View>
        </View>
    );
}

export default TeacherItem;