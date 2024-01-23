const storageKey = 'period-tracker';
const newPeriodForm = document.querySelectorAll('form')[0];
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const pastPeriodList = document.getElementById('past-period-list');

// handle form submission
newPeriodForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = self.crypto.randomUUID();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if(checkDatesInvalid(startDate, endDate)) {
        return;
    }

    // add to local storage
    const periods = getStoredPeriods();
    periods.push({id, startDate, endDate});
    periods.sort((a, b) => {
        return new Date(b.startDate) - new Date(a.startDate);
    });
    window.localStorage.setItem(storageKey, JSON.stringify(periods));
    newPeriodForm.reset();
    renderPastPeriods();
    
    // remove no data header and add ul for first submission
    if(pastPeriodList.querySelector('h3')) {
        pastPeriodList.querySelector('h3').remove();
    }
    let ul = pastPeriodList.querySelector('ul');
    if(!ul) {
        ul = document.createElement('ul');
        pastPeriodList.appendChild(ul);
    }
});
const checkDatesInvalid = (startDate, endDate) => {
    if(!startDate || !endDate || startDate > endDate) {
        alert('Please adjust the start date to come before the end date.');
        return true;
    }
    return false;
};

// local storage
const getStoredPeriods = () => {
    const data = window.localStorage.getItem(storageKey);
    const periods = data ? JSON.parse(data) : [];
    return periods;
};

// show past data and modify date
const renderPastPeriods = () => {
    const periods = getStoredPeriods();
  
    if(periods.length === 0) {
        // clear div
        pastPeriodList.innerHTML = '';
        // display prompt to add data
        const noDataMessage = document.createElement('h3');
        noDataMessage.textContent = 'No Data Yet';
        pastPeriodList.appendChild(noDataMessage);
        return;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {timeZone: 'UTC'});
    }
  
    pastPeriodList.innerHTML = '';
    const ul = document.createElement('ul');
    periods.forEach((period) => {
        const li = document.createElement('li');
        li.classList.add('period-date');
        li.textContent = `From ${formatDate(period.startDate,)} to ${formatDate(period.endDate)}`;
        li.setAttribute('id', `${period.id}`);
        ul.appendChild(li);
        pastPeriodList.appendChild(ul);
    });

    // remove items from local storage
    if(document.querySelector('.period-date')) {
        document.querySelectorAll('.period-date').forEach((periodDate) => {
            periodDate.addEventListener('click', (e) => {
                const id = periodDate.id;
                const allPeriods = JSON.parse(localStorage.getItem(storageKey));
                const date = periodDate.textContent;
                if(!confirm(`Delete: ${date}?`)) {
                    e.preventDefault();
                }else {
                    const newArray = allPeriods.filter((x) => x.id !== id);
                    window.localStorage.setItem(storageKey, JSON.stringify(newArray));
                    console.log(newArray);
                    renderPastPeriods();
                }
            });
        });
    }
}
window.addEventListener('load', renderPastPeriods());