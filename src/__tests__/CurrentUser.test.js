import * as curUser from '../components/CurrentUser';
import * as firebaseAuth from 'firebase/auth';

jest.mock('firebase/auth');

const { renderHook } = require('@testing-library/react');

test('render custom currentUser hook without crashing', () => {
  firebaseAuth.getAuth.mockReturnValue({ onAuthStateChanged: () => undefined });
  renderHook(() => curUser.useAuth());
})