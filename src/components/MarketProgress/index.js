import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import './marketProgress.less'

const MarketProgress = ({
  progress,
  logs,
  failed,
  success,
  transaction: { startTime, endTime },
  closeModal,
}) => {
  let strokeDasharray = Math.abs((progress) - 1) * Math.PI * (190 * 2)
  
  if (failed) {
    strokeDasharray = 0
  }

  const timeDiff = (startTime && endTime) ? moment(startTime).to(moment(endTime), true) : undefined

  let headerText = 'Market Creation in Progress'
  if (failed) {
    headerText = 'Sorry, something went wrong...'
  } else if (success) {
    headerText = 'Market Creation successful!'
  }

  let disclaimerText = 'It will take some time until all required Smart Contracts have been created. You will be notified after all Smart Contracts have been created. You can leave this page if you want.'
  if (failed) {
    disclaimerText = 'Something went wrong during the creation of your market. Please check that you are on the right network, that you have enough funds and you entered everything correctly. Contact us if this problem persists.'
  } else if (success) {
    disclaimerText = `Your Market was created successfully. ${timeDiff ? `It took ${timeDiff}.` : ''}`
  }

  let progressBarClass = 'running'
  if (failed) {
    progressBarClass = 'error'
  } else if (success) {
    progressBarClass = 'success'
  }

  return (
    <div className="marketProgress">
      {/* eslint-disable no-script-url */}
      <a className="marketProgress__close" href="javascript:void(0);" onClick={() => closeModal()} />
      {/* eslint-enable no-script-url */}
      <div className="container">
        <div className="marketProgress__header">{headerText}</div>
        <div className="marketProgress__disclaimer">{disclaimerText}</div>
        <div className="row">
          <div className="col-md-6">
            <div className={`radialProgressBar radialProgressBar--${progressBarClass}`}>
              <svg id="marketProgress__svg" width="400" height="400">
                <defs>
                  <linearGradient id="gnosisGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00a6c4" />
                    <stop offset="46%" stopColor="#05bdc4" />
                    <stop offset="100%" stopColor="#0adcc4" />
                  </linearGradient>
                </defs>
                <circle id="inner" r="190" cx="200" cy="200" fill="transparent" strokeDasharray="1193.8052" strokeDashoffset="0" />
                <circle id="bar" r="190" cx="200" cy="200" fill="transparent" strokeDasharray="1193.8052" strokeDashoffset={strokeDasharray} stroke="url(#gnosisGradient)" />
              </svg>
              <div className="radialProgressBar__label">{!failed && Math.ceil(progress * 100)}</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="marketProgress__logs">
              {logs.length > 0 ?
                logs.map((log, index) => {
                  const isLastRunning =
                    (!log.isDone && logs[index - 1] && logs[index - 1].isDone) ||
                    (index === 0 && !log.isDone)

                  return (
                    <div className={`marketProgress__logItem ${log.isDone ? '' : 'marketProgress__logItem--running'} ${isLastRunning && !failed ? 'marketProgress__logItem--currentActive' : ''}`} key={index}>
                      {log.label}
                    </div>
                  )
                })
                : <div className="marketProgress__logItem">Starting Transactions</div>
              }

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

MarketProgress.propTypes = {
  progress: PropTypes.number,
  logs: PropTypes.arrayOf(PropTypes.shape({
    isDone: PropTypes.bool,
    label: PropTypes.string,
  })),
  success: PropTypes.bool,
  failed: PropTypes.bool,
  transaction: PropTypes.shape({
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  }),
  closeModal: PropTypes.func,
}

export default MarketProgress
