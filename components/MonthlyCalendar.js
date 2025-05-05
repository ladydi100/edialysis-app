
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MonthlyCalendar = ({ onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    

    const prevMonthDays = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        currentMonth: false,
        day: prevMonthLastDay - i
      });
    }
    

    const daysInMonth = lastDay.getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        currentMonth: true,
        day: i
      });
    }
    
    // Días del siguiente mes para completar la última semana
    const nextMonthDays = 6 - lastDay.getDay();
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        currentMonth: false,
        day: i
      });
    }
    
    return days;
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleDateSelect = (date) => {
    onDateSelect(date);
  };

  const days = getDaysInMonth(currentDate);
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  return (
    <View style={styles.calendarContainer}>
      {/* Encabezado con mes y año */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handlePreviousMonth} style={styles.arrowButton}>
          <Ionicons name="chevron-back" size={24} color="#3B49B4" />
        </TouchableOpacity>

        <View style={styles.monthYearContainer}>
          <Text style={styles.monthText}>{currentMonth}</Text>
          <Text style={styles.yearText}>{currentYear}</Text>
        </View>

        <TouchableOpacity onPress={handleNextMonth} style={styles.arrowButton}>
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

      {/* Semanas del mes */}
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.weekContainer}>
          {week.map((day, dayIndex) => (
            <TouchableOpacity
              key={dayIndex}
              style={[
                styles.dayContainer,
                !day.currentMonth && styles.otherMonthDay,
                day.date.toDateString() === selectedDate.toDateString() && styles.selectedDay
              ]}
              onPress={() => day.currentMonth && handleDateSelect(day.date)}
              disabled={!day.currentMonth}
            >
              <Text style={[
                styles.dayText,
                !day.currentMonth && styles.otherMonthDayText,
                day.date.toDateString() === selectedDate.toDateString() && styles.selectedDayText
              ]}>
                {day.day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  monthYearContainer: {
    alignItems: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#101432',
  },
  yearText: {
    fontSize: 14,
    color: '#6B7280',
  },
  arrowButton: {
    padding: 8,
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
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 16,
    color: '#101432',
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  otherMonthDayText: {
    color: '#6B7280',
  },
  selectedDay: {
    backgroundColor: '#3B49B4',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default MonthlyCalendar;