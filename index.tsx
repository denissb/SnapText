import 'react-native-reanimated';
import {AppRegistry} from 'react-native';
import App from './src/App';
import Info from './app.json';

AppRegistry.registerComponent(Info.displayName, () => App);
