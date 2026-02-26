/**
 * DASHBOARD / HOME SCREEN
 * Main entry point of the chess app
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../../styles/homeStyles';

export default function HomeScreen() {
  const router = useRouter();

  const navigateToGame = (mode: string) => {
    router.push(`/game/${mode}` as any);
  };

  return (
    <ImageBackground
      source={require('@/assets/images/chess-bg.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>♔ Chess Master ♚</Text>
              <Text style={styles.subtitle}>Choose your game mode</Text>
            </View>

            {/* Game Mode Cards */}
            <View style={styles.cardsContainer}>

              {/* Local 1v1 */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigateToGame('local')}
                activeOpacity={0.8}
              >
                <View style={[styles.cardContent, { backgroundColor: '#4CAF50' }]}>
                  <Text style={styles.cardIcon}>👥</Text>
                  <Text style={styles.cardTitle}>Local 1v1</Text>
                  <Text style={styles.cardDescription}>
                    Play with a friend on the same device
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Play VS Computer */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigateToGame('ai')}
                activeOpacity={0.8}
              >
                <View style={[styles.cardContent, { backgroundColor: '#2196F3' }]}>
                  <Text style={styles.cardIcon}>🤖</Text>
                  <Text style={styles.cardTitle}>Play VS Computer</Text>
                  <Text style={styles.cardDescription}>
                    Challenge the computer
                  </Text>
                  <Text style={styles.comingSoon}>Coming Soon</Text>
                </View>
              </TouchableOpacity>

              {/* Online */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigateToGame('online')}
                activeOpacity={0.8}
              >
                <View style={[styles.cardContent, { backgroundColor: '#FF9800' }]}>
                  <Text style={styles.cardIcon}>🌐</Text>
                  <Text style={styles.cardTitle}>Online</Text>
                  <Text style={styles.cardDescription}>
                    Play over network
                  </Text>
                  <Text style={styles.comingSoon}>Coming Soon</Text>
                </View>
              </TouchableOpacity>

              {/* Puzzles */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push('/puzzles' as any)}
                activeOpacity={0.8}
              >
                <View style={[styles.cardContent, { backgroundColor: '#9C27B0' }]}>
                  <Text style={styles.cardIcon}>🧩</Text>
                  <Text style={styles.cardTitle}>Puzzles</Text>
                  <Text style={styles.cardDescription}>
                    Tactical challenges
                  </Text>
                  <Text style={styles.comingSoon}>Coming Soon</Text>
                </View>
              </TouchableOpacity>

              {/* Learn Chess */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push('/learn' as any)}
                activeOpacity={0.8}
              >
                <View style={[styles.cardContent, { backgroundColor: '#E91E63' }]}>
                  <Text style={styles.cardIcon}>📚</Text>
                  <Text style={styles.cardTitle}>Learn Chess</Text>
                  <Text style={styles.cardDescription}>
                    Master the basics & openings
                  </Text>
                  <Text style={styles.comingSoon}>Coming Soon</Text>
                </View>
              </TouchableOpacity>

            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <Text style={styles.statsTitle}>Your Stats</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Games</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Wins</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Puzzles</Text>
                </View>
              </View>
            </View>

          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}