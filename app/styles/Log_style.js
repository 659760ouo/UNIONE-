import { requireNativeModule } from "expo";
import { Dimensions, StyleSheet } from "react-native"
const {width, height} = Dimensions.get('window')

const Log_style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    
    title: {
        color: 'black',
        fontSize: 25,
        top: '8%',
        paddingTop: '12%',
    

    },
    logPill: {
        flexDirection: 'row',
        backgroundColor: '#545252',
        width: '60%',
        height: '8%',
        left: '20%', 
        top: '7%',
        borderRadius: 10,
        opacity: 0.8,
        shadowColor: 'black',
        shadowRadius: 30,
        shadowOpacity: 0.8,
        shadowOffset: { width: 0, height: 0 },
        // justifyContent: 'space-around', // Space out the text evenly
        // alignItems: 'center', // Center the text vertically
    },
    btntxt: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'transparent', // Remove the white background
        // position: 'relative', // Change from fixed to relative
        borderRadius: 0, 
        left: '5%',
        top: '20%'
        
       


    },
    toggleBtn: {
        flexDirection: 'row',
        opacity: 1,
        // position: 'absolute',
    },
    enter_field: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        
        
    },
    log_input: {
        width: '90%',
        height: '8%',
        borderRadius: 8,
        top: '10%',
        paddingTop: 30,
        marginTop: 20,
        fontWeight: 'bold',
        opacity: 0.9,
        fontSize: 15,
        shadowColor: 'black',
        shadowRadius: 15,
        shadowOpacity: 0.6,
        shadowOffset: { width: 0, height: 0 },
        
        
        backgroundColor: '#ffffff',
        
        paddingLeft: 20
    },
    log_btn: {
        marginTop: 30,
        width: '90%',
        height: '7%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#340191',
        top: '10%',
        opacity: 1
    },
    LR_txt: {
        color: 'white',
        fontSize: 20,
        
    },
  
    key: {
        
        color: 'black',
        fontWeight: 'bold' ,
        top: 80
    },
   
    requirements:{
        borderWidth: 2,
        width: '72%',
        height: '9%',
        top: '10%',
        backgroundColor: 'white',
        borderRadius: 15,
        backgroundColor: '#fdfdfda7',
        flexDirection: 'column',
        alignItems: 'center',
        borderColor: '#d4d4d4e7'
    },

    requ_txt: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'red',
        top: '5%'
    },
    toggleTextContainer:{
        top: '17%'
    },
    icon_container:{
        position: 'absolute',
        top: 60,
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconView:{
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        heigh: 70,
        margin: 10,
        backgroundColor: '#e6e4e4ff'
        
    },
    icon: {
        width: 55,
        height: 55
    }
});

 export default Log_style;