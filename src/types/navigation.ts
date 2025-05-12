import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Auth: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Main: undefined;
  Profile: undefined;
  ProfileScreen: undefined;
  EditNameScreen: {
    name: string;
  };
  EditEmailScreen: {
    email: string;
  };
  EditPhoneScreen: {
    phone: string;
  };
  EditProfile: { user: any };
  ChangePassword: undefined;
  TwoFactorAuth: undefined;
  SecuritySettings: undefined;
  Notifications: undefined;
  DarkMode: undefined;
  Language: undefined;
  HelpCenter: undefined;
  ContactSupport: undefined;
  About: undefined;
  ActivityDetails: { activityId: string };
  ItineraryBuilder: { tripId: string };
  Booking: { activityId: string };
  BookingConfirmation: { bookingId: string };
};

export type RootStackNavigation = NativeStackNavigationProp<RootStackParamList>;

export type RootStackNavigationProps = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
};
