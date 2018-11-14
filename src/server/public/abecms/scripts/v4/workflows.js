var template = $('#hds-workflows').html();

function mountWorkflows (data) {
	console.log(data)
	for (var i in data.roles) {
		let role = data.roles[i]

		var divRoleWrapper = $('<div class="role-wrapper"></div>');
		var divContentWorkflows = $(`<div class="role-name">${role.name}</div>`)
		var divWorkflowFlex = $(`<div class="workflow-flex">`)

		var divWorkflowWrapper = $(`<div class="workflow-wrapper"></div>`)
		var divWorkflowBox = $(`<div class="workflow-box"></div>`)

		var divWorkflowTitle = $(`<div class="workflow-title">draft :</div>`)

		var divWorkflowActifs = []
		for (var i in data.workflowUrl.draft) {
			var wurl = data.workflowUrl.draft[i]
			console.log(wurl)
			if (wurl.action == "edit") {
				divWorkflowActifs.push($(`<div class="workflow-actif">edit in <b>${wurl.workflow}</b></div>`))
			}
			else if (wurl.action == "previous") {
				divWorkflowActifs.push($(`<div class="workflow-actif">to <b>${wurl.previous}</b> status</div>`))
			}
			else if (wurl.action == "submit") {
				divWorkflowActifs.push($(`<div class="workflow-actif">to <b>${wurl.next}</b> status</div>`))
			}
		}

		divWorkflowBox.append(divWorkflowTitle, divWorkflowActifs)
		divWorkflowWrapper.append(divWorkflowBox)
		divWorkflowFlex.append(divWorkflowWrapper)
		divRoleWrapper.append(divContentWorkflows, divWorkflowFlex)

		$('#content-workflows').append(divRoleWrapper);

	}
}

$(document).ready(function() {
	$.ajax({
		url: '/abe/api/workflows/full'	
	})
	.done(function(data) {
		mountWorkflows(data)
	})
	.fail(function(err) {
		console.log(err)
	})

})
