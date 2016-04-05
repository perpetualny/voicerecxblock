"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources
import logging

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String, Boolean, List, Dict, Float
from xblock.fragment import Fragment

from utils import load_resource, render_template
from xblockutils.resources import ResourceLoader
from django.template import Context, Template

# Please start and end the path with a trailing slash
log = logging.getLogger(__name__)
loader = ResourceLoader(__name__)


class AttrDict(dict):

    def __init__(self, *args, **kwargs):
        super(AttrDict, self).__init__(*args, **kwargs)
        self.__dict__ = self


class VoiceRecognizerXBlock(XBlock):

    """
    TO-DO: document what your XBlock does.
    """

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.

    display_name = String(display_name="Display Name",
                          default="Voice Recognizer XBlock",
                          scope=Scope.settings
                          )

    lang = String(default="en-US",
                  scope=Scope.settings
                  )

    mode = String(default="standerd",
                  scope=Scope.settings
                  )

    score = Float(
        default=0,
        scope=Scope.user_state
    )

    data = String(default="Hello",
                  scope=Scope.settings
                  )

    answer = String(default="",
                    scope=Scope.user_state
                    )

    weight = Float(
        default=1,
        scope=Scope.settings
    )

    max_attempts = Integer(
        default=1,
        scope=Scope.settings
    )

    attempts = Integer(
        default=0,
        scope=Scope.user_state
    )

    has_score = True

    def resource_string(self, path):
        """
            Handy helper for getting resources from our kit.
        """
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
            The primary view of the RadPatternsXBlock, shown to students
            when viewing courses.
        """
        frag = Fragment()
        frag.add_content(render_template("static/html/voicerecognizer.html",
                                         {'self': self, 'context': context}
                                         ))
        frag.add_css(self.resource_string("static/css/voicerecognizer.css"))
        frag.add_javascript(
            self.resource_string("static/js/voicerecognizer.js"))
        frag.initialize_js('VoiceRecognzerXBlock')
        return frag

    # Edit view
    def studio_view(self, context=None):

        frag = Fragment()
        frag.add_content(render_template("static/html/voicerecognizer_edit.html",
                                         {'self': self, 'context': context}
                                         ))

        frag.add_javascript(
            self.resource_string('static/js/voicerecognizer_edit.js'))

        frag.initialize_js('VoiceRecognzerEditXBlock')
        return frag

    # TO-DO: change this handler to perform your own actions.  You may need more
    # than one handler, or you may not need any handlers at all.
    @XBlock.json_handler
    def studio_submit(self, data, suffix=''):
        """
            This function is used to add stuff to the xblock student view
            after user adds a xblock
        """
        try:
            self.lang = data.get("lang")
            self.display_name = data.get("display_name")
            self.mode = data.get("mode")
            self.data = data.get("data").strip(' \t\n\r')
            self.waight = data.get("waight")
            self.max_attempts = data.get("max_attempts")
            return {'status': 'success'}
        except:
            return {'status': 'error'}

    def getRemainingAttempts(self):
        return self.max_attempts - self.attempts

    @XBlock.json_handler
    def check_voice(self, data, suffix=''):
        """
            This function is used to add stuff to the xblock student view
            after user adds a xblock
        """
        try:
            voice_data = data.get("data")
            self.answer = voice_data
            if self.attempts < self.max_attempts:
                if voice_data.lower().strip(' \t\n\r') == self.data.lower():
                    if self.score == 0:
                        self.score = 1
                        self.runtime.publish(
                            self, "grade", {'value': self.score, 'max_value': 1})
                    self.attempts += 1
                    return {'status': 'success', 'submit': True}
                else:
                    self.attempts += 1
                    return {'status': 'success', 'submit': False, 'remaining_attempts': self.getRemainingAttempts()}
            else:
                return {'status': 'success', 'submit': False, 'remaining_attempts': self.getRemainingAttempts()}
        except:
            return {'status': 'error'}
