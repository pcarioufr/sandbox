terraform {
  required_providers {
    datadog = {
      source = "DataDog/datadog"
    }
  }
}


variable "datadog_api_key" {
  type    = string
  sensitive   = true
}

variable "datadog_app_key" {
  type        = string
  sensitive   = true
}


# Configure the Datadog provider
provider "datadog" {
  api_key = var.datadog_api_key
  app_key = var.datadog_app_key
}

resource "datadog_monitor" "foo" {
  name               = "Name for monitor foo"
  type               = "metric alert"
  message            = "Monitor triggered. Notify: @hipchat-channel"
  escalation_message = "Escalation message @pagerduty"

  query = "avg(last_1h):avg:aws.ec2.cpu{environment:foo,host:foo} by {host} > 4"

  monitor_thresholds {
    warning  = 2
    critical = 4
  }

  include_tags = true

  tags = ["team:sandbox", "owner:terraform"]
}