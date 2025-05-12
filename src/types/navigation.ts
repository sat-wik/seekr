import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Auth: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Main: undefined;
  Profile: undefined;
  ActivityDetails: { activityId: string };
  ItineraryBuilder: { tripId: string };
  Booking: { activityId: string };
  BookingConfirmation: { bookingId: string };
};

export type RootStackNavigation = NativeStackNavigationProp<RootStackParamList>;

export type RootStackNavigationProps = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
};
