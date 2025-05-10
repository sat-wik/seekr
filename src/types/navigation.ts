import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Welcome: undefined;
  AIWelcome: undefined;
  Main: undefined;
  ActivityDetails: { activityId: string };
  ItineraryBuilder: { tripId: string };
  Booking: { activityId: string };
  BookingConfirmation: { bookingId: string };
};

export type RootStackNavigation = NativeStackNavigationProp<RootStackParamList>;

export type RootStackNavigationProps = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
};
