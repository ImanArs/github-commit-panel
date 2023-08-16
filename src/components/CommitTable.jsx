import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from './CommitTable.module.scss';

const CommitTable = () => {
  const [commitData, setCommitData] = useState(null);
  const [monthCommits, setMonthCommits] = useState({}); // Объект с данными месяца

  const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    axios.get('https://dpg.gg/test/calendar.json')
      .then(response => {
        setCommitData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (commitData) {
      const monthsData = {};

      for (const key in commitData) {
        if (Object.hasOwnProperty.call(commitData, key)) {
          const dateString = key;
          const date = new Date(dateString);
          const options = { month: 'long' };
          const monthName = date.toLocaleString('en-US', options);

          if (!monthsData[monthName]) {
            monthsData[monthName] = {};
          }

          const dayOfMonth = date.getDate();
          monthsData[monthName][dayOfMonth] = commitData[key];
        }
      }
      setMonthCommits(monthsData);
    }
  }, [commitData]);

  const getBgCom = (num) => {
    if (num > 0 && num <= 10) {
      return styles.hasLessTen;
    } else if (num > 10 && num < 20) {
      return styles.hasLessTwnt;
    } else if ( num > 20 && num < 30) {
      return styles.hasLessThrt;
    } else if (num >= 30) {
      return styles.hasMoreThrt;
    } else {
      return styles.day;
    }
  };

  return (
    <div className={styles.commitTable}>
      {Object.keys(monthCommits).map((month, monthIndex) => {
        const daysInMonth = new Date(2022, monthIndex + 1, 0).getDate();

        return (
          <div key={monthIndex} className={styles.monthContainer}>
            <div className={styles.monthTitle}>{month}</div>
            <div className={styles.weekDays}>
              {week.map((day, dayIndex) => (
                <div key={dayIndex} className={styles.weekDay}>{day}</div>
              ))}
            </div>
            <div className={styles.daysContainer}>
              {[...Array(daysInMonth)].map((_, dayOfMonth) => {
                const commitCount = monthCommits[month][dayOfMonth + 1] || 0;
                const cellClassName = `${styles.day} ${getBgCom(commitCount)}`;
                return (
                  <div key={dayOfMonth} className={cellClassName} title={` u have ${commitCount} commits`}>
                    {/* {commitCount > 0 && commitCount} */}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommitTable;
