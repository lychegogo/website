
from django.conf.urls import patterns, url
import os

urlpatterns=[
    url(r'^$', 'task5.views.index'),
    url(r'^/$', 'task5.views.index'),
    url(r'^index$', 'task5.views.index'),
    url(r'^get_cpu_content$', 'task5.views.get_cpu_content'),
    url(r'^get_disk_content$', 'task5.views.get_disk_content'),
    url(r'^get_memory_content$', 'task5.views.get_memory_content'),
    url(r'^get_cpu_use_info$', 'task5.views.get_cpu_use_info'),
    url(r'^get_disk_use_info$', 'task5.views.get_disk_use_info'),
    url(r'^get_memory_use_info$', 'task5.views.get_memory_use_info'),
    url(r'^get_chart$', 'task5.views.get_chart'),
    url(r'^get_top5_memory$', 'task5.views.get_top5_memory'),
    url(r'^get_top5_cpu$', 'task5.views.get_top5_cpu'),
    url(r'^get_top5_disk$', 'task5.views.get_top5_disk'),
]