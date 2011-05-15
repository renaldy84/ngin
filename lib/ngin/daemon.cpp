#include <v8.h>
#include <node.h>

#include <iostream> // cin, cout, endl
// Required by for routine
#include <sys/types.h>
#include <unistd.h>

// Declaration for exit()
#include <stdlib.h>   

using namespace node;
using namespace v8;
 
static Handle<Value> daemonize(const Arguments& args)
{
	pid_t pID = fork();

	if(pID > 0)
		exit(0);
	
	if(pID < 0)
		exit(1);

	umask(0);

	if(setsid() < 0)
		exit(1);

	return Integer::New(getpid());
}
 
extern "C" {
	static void init(Handle<Object> target)
	{
		NODE_SET_METHOD(target, "daemonize", daemonize);
	}

	NODE_MODULE(daemon, init);
}