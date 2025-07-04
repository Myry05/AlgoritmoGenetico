import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card, 
  HelperText,
  Divider,
  TouchableRipple
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, clearError } from '@/store/slices/authSlice';
import { LoginForm } from '@/types';
import { theme } from '@/theme';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    dispatch(clearError());
    dispatch(loginUser(form));
  };

  const isFormValid = form.email && form.password;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineLarge" style={styles.title}>
              {t('auth.login')}
            </Text>
            
            <TextInput
              label={t('auth.email')}
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={styles.input}
            />

            <TextInput
              label={t('auth.password')}
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
              mode="outlined"
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon 
                  icon={showPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
            />

            {error && (
              <HelperText type="error" visible={true}>
                {error}
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit}
              disabled={!isFormValid || isLoading}
              loading={isLoading}
              style={styles.button}
            >
              {t('auth.signIn')}
            </Button>

            <TouchableRipple
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.linkButton}
            >
              <Text variant="bodyMedium" style={styles.linkText}>
                {t('auth.forgotPassword')}
              </Text>
            </TouchableRipple>

            <Divider style={styles.divider} />

            <TouchableRipple
              onPress={() => navigation.navigate('Register')}
              style={styles.linkButton}
            >
              <Text variant="bodyMedium" style={styles.linkText}>
                {t('auth.signUp')}
              </Text>
            </TouchableRipple>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  card: {
    padding: theme.spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    color: theme.colors.primary,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  button: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  linkButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  linkText: {
    textAlign: 'center',
    color: theme.colors.primary,
  },
  divider: {
    marginVertical: theme.spacing.md,
  },
});