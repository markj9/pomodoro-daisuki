View = require './view'
TimerConfig = require '../models/timer_config'
application = require 'application'
template = require './templates/options'

module.exports = class OptionsView extends View
  template: template
  el: "#options-modal"

  events:
    "click #update": "update"

  initialize: ->
    @timerConfig = new TimerConfig()

  getRenderData: ->
    @timerConfig.toJSON()

  afterRender: ->
    @$el.modal(backgrop: 'static', show: true)
    
    this

  update: ->
    data =
      pomodoroDuration    : $('#inputPomodoroDuration').val()
      shortBreakDuration  : $('#inputShortBreakDuration').val()
      longBreakDuration   : $('#inputLongBreakDuration').val()

    @timerConfig.update data
    @$el.modal('hide')
    application.router.navigate 'home/resetOptions', true
