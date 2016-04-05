from django import template

register = template.Library()

import sys

reload(sys)

sys.setdefaultencoding("utf-8")

@register.filter
def encode_utf(string):
    try:
        return string.decode('utf-8')
    except:
        return None

@register.filter
def get_remaining_attempts(attempts,max_attempts):
    try:
        return int(max_attempts) - int(attempts)
    except:
        return None
