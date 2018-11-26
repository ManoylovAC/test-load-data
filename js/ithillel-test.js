window.onload = onLoadFn;

function onLoadFn() {
  const taskOptions = {
    buttonId: 'getList',
    storageKey: 'json-storage',
    resultBlockId: 'resultList',
    dataFilesPaths: ['./data/data_1.json', './data/data_2.json']
  };
  let resultList = [];
  const dataLoadButton = document.getElementById(taskOptions.buttonId);

  if (isStorageAvailable('localStorage')) {
    resultList = getJsonFromLocalStorage(taskOptions.storageKey);
    if (resultList) {
      renderJsonData(resultList, taskOptions.resultBlockId);
    }
  }

  if (dataLoadButton) {
    dataLoadButton.addEventListener('click', onClickLoadButton);
  }


  function onClickLoadButton() {
    const jsonDataList = [];
    let countOfFiredRequests = 0;

    taskOptions.dataFilesPaths.forEach((filePath) => {
      loadJSON(
        filePath,
        resJson => {
          jsonDataList.push(resJson);

          if (++countOfFiredRequests === taskOptions.dataFilesPaths.length) {
            allDataIsLoad(jsonDataList);
          }
        },
        error => {
          console.warn(error);
          if (++countOfFiredRequests === taskOptions.dataFilesPaths.length) {
            allDataIsLoad(jsonDataList);
          }
        }
      );
    });

    function allDataIsLoad(jsonDataList) {
      resultList = [];
      jsonDataList.forEach(item => {
        resultList = resultList.concat(item.data.list);
      });

      setJsonToLocalStorage(taskOptions.storageKey, resultList);
      renderJsonData(resultList, taskOptions.resultBlockId);
    }
  }

  function renderJsonData(jsonData, containerIdName) {
    let resultItems = '';
    jsonData.forEach((item) => {
      resultItems += '<div class="item"><span class ="item__title">' + item.title + '</span></div>';
    });

    document.getElementById(containerIdName).innerHTML = resultItems;
  }

  function loadJSON(filePath, success, error) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          if (success) {
            success(JSON.parse(xhr.responseText));
          }
        } else {
          if (error) {
            error(xhr);
          }
        }
      }
    };
    xhr.open("GET", filePath, true);
    xhr.send();
  }

  function isStorageAvailable(type) {
    try {
      const storage = window[type];
      const testStr = '_storage_test_';
      storage.setItem(testStr, testStr);
      storage.removeItem(testStr);
      return true;
    } catch (e) {
      return false;
    }
  }

  function setJsonToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function getJsonFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }
}