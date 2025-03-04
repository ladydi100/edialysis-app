import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WeeklyCalendar = ({ onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getWeekDates = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    return Array.from({ length: 7 }).map((_, index) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + index);
      return day;
    });
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleDateSelect = (date) => {
    onDateSelect(date);
  };

  const weekDates = getWeekDates(currentDate);
  const currentMonth = monthNames[currentDate.getMonth()];

  return (
    <View style={styles.calendarContainer}>
      {/* Fecha anterior, Mes, Fecha siguiente */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handlePreviousWeek} style={styles.arrowButton}>
          <Ionicons name="chevron-back" size={24} color="#3B49B4" />
        </TouchableOpacity>

        <Text style={styles.monthText}>{currentMonth}</Text>

        <TouchableOpacity onPress={handleNextWeek} style={styles.arrowButton}>
          <Ionicons name="chevron-forward" size={24} color="#3B49B4" />
        </TouchableOpacity>
      </View>

      {/* Días de la semana */}
      <View style={styles.daysOfWeekContainer}>
        {daysOfWeek.map((day, index) => (
          <Text key={index} style={styles.dayOfWeekText}>
            {day}
          </Text>
        ))}
      </View>

      {/* Fechas */}
      <View style={styles.datesContainer}>
        {weekDates.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dateContainer,
              date.toDateString() === selectedDate.toDateString() && styles.selectedDate
            ]}
            onPress={() => handleDateSelect(date)}
          >
            <Text style={styles.dateText}>{date.getDate()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  arrowButton: {
    padding: 10,
  },
  monthText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#101432',
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayOfWeekText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    flex: 1,
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    borderRadius: 10,
    width: 40,
  },
  selectedDate: {
    backgroundColor: '#3B49B4',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#101432',
  },
});

export default WeeklyCalendar;