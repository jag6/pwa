const newPeriodForm = document.querySelectorAll('form')[0];
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const pastPeriodList = document.getElementById('past-period-list');

// handle form submission
newPeriodForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if(checkDatesInvalid(startDate, endDate)) {
        return;
    }

    storeNewPeriod(startDate, endDate);
    
    // remove no data header and add ul for first submission
    if(pastPeriodList.querySelector('h3')) {
        pastPeriodList.querySelector('h3').remove();
    }
    let ul = pastPeriodList.querySelector('ul');
    if(!ul) {
        ul = document.createElement('ul');
        pastPeriodList.appendChild(ul);
    }

    renderPastPeriods();
    newPeriodForm.reset();
});
const checkDatesInvalid = (startDate, endDate, e) => {
    if(!startDate || !endDate || startDate > endDate) {
        alert('Please adjust the start date to come before the end date.');
        e.preventDefault();
    }
    return false;
};

// add to local storage
const storageKey = 'period-tracker';
const storeNewPeriod = (startDate, endDate) => {
    const periods = getAllStoredPeriods();
    periods.push({startDate, endDate});

    periods.sort((a, b) => {
        return new Date(b.startDate) - new Date(a.startDate);
    });

    window.localStorage.setItem(storageKey, JSON.stringify(periods));
};
const getAllStoredPeriods = () => {
    const data = window.localStorage.getItem(storageKey);
    const periods = data ? JSON.parse(data) : [];

    return periods;
};

// show past data and modify date
const renderPastPeriods = () => {
    const periods = getAllStoredPeriods();
  
    if(periods.length === 0) {
        return;
    }
  
    pastPeriodList.innerHTML = '';
    const ul = document.createElement('ul');
  
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {timeZone: 'UTC'});
    }

    periods.forEach((period) => {
        const li = document.createElement('li');
        li.textContent = `From ${formatDate(period.startDate,)} to ${formatDate(period.endDate)}`;
        ul.appendChild(li);
        pastPeriodList.appendChild(ul);
    });
}
if(window.localStorage.getItem(storageKey)) {
    renderPastPeriods();
}else {
    const noDataMessage = document.createElement('h3');
    noDataMessage.textContent = 'No Data Yet';
    pastPeriodList.appendChild(noDataMessage);
}