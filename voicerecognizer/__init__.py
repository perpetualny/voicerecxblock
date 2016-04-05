from .voicerecognizer import VoiceRecognizerXBlock
from django.template.loader import add_to_builtins

add_to_builtins('voicerecognizer.templatetags.vsr')