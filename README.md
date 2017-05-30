# Breaking the Monolith by using hapi 
## Background
Let me get the disclaimer out of the way: I am not an expert on Hapi
I started looking into Hapi's ability to break components out.
This is my attempt to follow other tutorials from a hello world to a true component system.
I have broken this down into the following steps

| Project  | Description | Link |
|---|---|---|
|hapi-tut-monolith-01|A simple hello world hapi project| [01](https://github.com/quapaw/hapi-tut-monolith-01)|
|hapi-tut-monolith-02a|Add services - customers and products| [02A](https://github.com/quapaw/hapi-tut-monolith-02a)|
|hapi-tut-monolith-02b|Adding Glue and externalizing config| [02B](https://github.com/quapaw/hapi-tut-monolith-02b)|
|hapi-tut-monolith-02c|Moving services into their own folders| [02C](https://github.com/quapaw/hapi-tut-monolith-02c)|
|**hapi-tut-monolith-03-main**|**Moved service into own project. Instructions here**|**[03-main](https://github.com/quapaw/hapi-tut-monolith-03-main)**|
|hapi-tut-monolith-03-customer|Just the customer service| [03-customers](https://github.com/quapaw/hapi-tut-monolith-03-customers)|
|hapi-tut-monolith-03-products|Just the produce service| [03-products](https://github.com/quapaw/hapi-tut-monolith-03-products)|
|hapi-tut-monolith-04a-customer|Movement of some files| [04a-customers](https://github.com/quapaw/hapi-tut-monolith-04a-customers)|
|hapi-tut-monolith-04b-customer|New methods| [04b-customers](https://github.com/quapaw/hapi-tut-monolith-04b-customers)|
|hapi-tut-monolith-04c-customer|Validation and Error Handling|[04c-customers](https://github.com/quapaw/hapi-tut-monolith-04c-customers)|
|hapi-tut-monolith-04d-customer|Unit Testing|[04d-customers](https://github.com/quapaw/hapi-tut-monolith-04d-customers)|
|hapi-tut-monolith-04e-customer|Add Mongo and API Doc|[04e-customers](https://github.com/quapaw/hapi-tut-monolith-04e-customers)|
|hapi-tut-monolith-05-customer|Combine work with products for full deployment|[05-customers](https://github.com/quapaw/hapi-tut-monolith-05-customers)|
|hapi-tut-monolith-05-product|Combine work with products for full deployment|[05-products](https://github.com/quapaw/hapi-tut-monolith-05-product)|
|hapi-tut-monolith-05-main|Combine work with products for full deployment|[05-main](https://github.com/quapaw/hapi-tut-monolith-05-main)|
|hapi-tut-monolith-06-customer|Move from npm to yarn|[06-customers](https://github.com/quapaw/hapi-tut-monolith-06-customers)|
|hapi-tut-monolith-07-customer|Customer project to go with 07-main|[07-customers](https://github.com/quapaw/hapi-tut-monolith-07-customers)|
|hapi-tut-monolith-07-product|Product project to go with 07-main|[07-products](https://github.com/quapaw/hapi-tut-monolith-07-products)|
|hapi-tut-monolith-07a-main|Catch up with 06 changes|[07a-main](https://github.com/quapaw/hapi-tut-monolith-07a-main)|
|**hapi-tut-monolith-07b-main**|**Change in configuration**|**[07a-main](https://github.com/quapaw/hapi-tut-monolith-07a-main)**|



# HAPI Tutorial - Monolith - 7b - main
This step updates the main project configuration files.
We will utilize two different libraries to help us externalize configuration between each environment

* [confidence](https://github.com/hapijs/confidence)
  Used to switch configuration bases on a setting
* [dotenv](https://www.npmjs.com/package/dotenv)
  Used to store external configuration per environment    

## confidence
We are going to utilize [confidence](https://github.com/hapijs/confidence) to allow use to switch configuration items based off of environment settings

* Install
  You will need to run ```yarn add confidence --save```
  
* Create a single manifest.json
    * Move items out of ManifestBuild.js into manifest.json
        You manifest.json should look like

        ```
        {
          "server": {
            "app": {
              "slogan": "We push the web forward"
            }
          },
          "connections": [
            {
              "port":   3000,
              "labels": ["api"],
              "host":   "localhost"
            }
            //,
            //{
            //    port: 8443,
            //    host: 'localhost',
            //    tls: {
            //        key: Fs.readFileSync('server.key'),
            //        cert: Fs.readFileSync('server.crt')
            //    },
            //    labels: 'https'
            //}
          ],
          "registrations": [
            {
              "plugin": {
                "register": "hapi-mongodb",
                "options": {
                  "url": "mongodb://localhost:27017/test",
                  "settings": {
                    "poolSize": 10
                  },
                  "decorate": true
                }
            },
            {
              "plugin": {
                "register": "customers"
              }
            },
            {
              "plugin": {
                "register": "products"
              }
            },
            {
              "plugin": {
                "register": "vision"
              }
            },
            {
              "plugin": {
                "register": "inert"
              }
            },
            {
              "plugin": {
                "register": "hapi-swagger"
              }
            },
            {
              "plugin": {
                "register": "blipp"
              }
            },
            {
              "plugin": {
                "register": "good",
                "options": {
                  "ops": {
                    "interval": 3000
                  },
                  "reporters": {
                    "myConsoleReporter": [
                      {
                        "module": "good-squeeze",
                        "name": "Squeeze",
                        "args": [
                          {
                            "log": "*",
                            "response": "*"
                          }
                        ]
                      },
                      {
                        "module": "good-console"
                      },
                      "stdout"
                    ],
                    "myFileReporter": [
                      {
                        "module": "good-squeeze",
                        "name": "Squeeze",
                        "args": [
                          {
                            "ops": "*"
                          }
                        ]
                      },
                      {
                        "module": "good-squeeze",
                        "name": "SafeJson"
                      },
                      {
                        "module": "good-file",
                        "args": [
                          "./test/fixtures/awesome_log"
                        ]
                      }
                    ]
                  }
                }
              }
            }
          ]
        }   
        ```    
        
    
    * Move items from manifest-doc.json and manifest-logging.json into manifest.json
        You will notice I took out the https section out
    
        ```
        {
          "server": {
            "app": {
              "slogan": "We push the web forward"
            }
          },
          "connections": [
            {
              "port":   3000,
              "labels": ["api"],
              "host":   "localhost"
            }
        
          ],
          "registrations": [
            {
              "plugin": {
                "register": "hapi-mongodb",
                "options": {
                  "url": "mongodb://localhost:27017/test",
                  "settings": {
                    "poolSize": 10
                  },
                  "decorate": true
                }
              }
            },
            {
              "plugin": {
                "register": "customers"
              }
            },
            {
              "plugin": {
                "register": "products"
              }
            },
            {
              "plugin": {
                "register": "vision"
              }
            },
            {
              "plugin": {
                "register": "inert"
              }
            },
            {
              "plugin": {
                "register": "hapi-swagger"
              }
            },
            {
              "plugin": {
                "register": "blipp"
              }
            },
            {
              "plugin": {
                "register": "good",
                "options": {
                  "ops": {
                    "interval": 3000
                  },
                  "reporters": {
                    "myConsoleReporter": [
                      {
                        "module": "good-squeeze",
                        "name": "Squeeze",
                        "args": [
                          {
                            "log": "*",
                            "response": "*"
                          }
                        ]
                      },
                      {
                        "module": "good-console"
                      },
                      "stdout"
                    ],
                    "myFileReporter": [
                      {
                        "module": "good-squeeze",
                        "name": "Squeeze",
                        "args": [
                          {
                            "ops": "*"
                          }
                        ]
                      },
                      {
                        "module": "good-squeeze",
                        "name": "SafeJson"
                      },
                      {
                        "module": "good-file",
                        "args": [
                          "./test/fixtures/awesome_log"
                        ]
                      }
                    ]
                  }
                }
              }
            }
          ]
        }   
        ```

    * Your ManifestBuilder.js should be very simple at this point
       
        ```
         'use strict';
                
         class ManifestBuilder {
             getManifest() {
                 const manifest  = require('./manifest.json');
                 
                 return manifest;
             }
         }
         
         module.exports = ManifestBuilder;
        ```
     
    * Add a switch based on protocol setting in .env in the next section
        Change to connection section to be based off environment variable called PROTOCOL
        * Old connection
            
            ```
            "connections": [
                {
                  "port":   3000,
                  "labels": ["api"],
                  "host":   "localhost"
                }
            
              ],
            ```
        * New Connection section
            
            ```
            "connections": [
              {
                "$filter": "PROTOCOL",
                "https": {
                  "port": 3443,
                  "labels": ["api"],
                  "host":   "localhost",
                  "tls": {
                    "tls": {
                      "key": "./config/server.key",
                      "cert": "./config/server.crt"
                    }
                  }
                },
                "$default": {
                  "port":   3000,
                  "labels": ["api"],
                  "host":   "localhost"  
                }
              }
            ],
            ```
       
## dotenv
We are going to utilize [dotenv](https://www.npmjs.com/package/dotenv) to externalize items that change between each environment we are running in.

* Install
  You will need to run ```yarn add dotenv --save```
  
* Create .env file that will have items that you want to externalize
    We will add the following
    
    ```
    # ##################### #
    # Mongo URL - mongodb://id:password@server:port/db
    MONGO_URL=mongodb://localhost:27017/test
    
    # PROTOCOL - choices http / https
    PROTOCOL=https
    HTTP_PORT=8080
    HTTPS_PORT=8443
    ```
* Change ManifestBuilder to use both libraries
    This will work for http protocol but no https yet
    
    ```
     'use strict';
        
        
        class ManifestBuilder {
        
            getManifest() {
                const Fs = require('fs');
        
                const rawManifest  = require('./manifest.json');
                const Dotenv       = require('dotenv');
                const Confidence   = require('confidence');
                var   store        = new Confidence.Store();
        
                Dotenv.config({ path: `${__dirname}/../.env`});
        
        
                store.load(rawManifest);
                var simiManifest = store.get('/', process.env);
        
                return simiManifest;
            }
        }
        
        module.exports = ManifestBuilder;
    ```
    
* Change Manifest to using .env mongo connection string
    This will over write what is in the json file with the environment file
    
    ```
    simiManifest.registrations[0].plugin.options.url = process.env.MONGO_URL;
    ```
    
* Change Manifest to read the https cert and key  file  name and actually get the contents from those files
    This should allow https to work if you generate a key and cert and put them in the config directory
    
    ```
    if (process.env.PROTOCOL === 'https') {
        const key  = simiManifest.connections[0].tls.key;
        const cert = simiManifest.connections[0].tls.cert;

        simiManifest.connections[0].tls.key  = Fs.readFileSync(key);
        simiManifest.connections[0].tls.cert = Fs.readFileSync(cert);
        simiManifest.connections[0].prot     = process.env.HTTPS_PORT;
    } else {
        simiManifest.connections[0].port     = process.env.HTTP_PORT;
    }

    ```
    
* The final ManifestBuilder.js file should look like

    ```
    'use strict';
    
    
    class ManifestBuilder {
    
        getManifest() {
            const Fs = require('fs');
    
            const rawManifest  = require('./manifest.json');
            const Dotenv       = require('dotenv');
            const Confidence   = require('confidence');
            var   store        = new Confidence.Store();
    
            Dotenv.config({ path: `${__dirname}/../.env`});
    
    
            store.load(rawManifest);
            var simiManifest = store.get('/', process.env);
    
            simiManifest.registrations[0].plugin.options.url = process.env.MONGO_URL;
    
            if (process.env.PROTOCOL === 'https') {
                const key  = simiManifest.connections[0].tls.key;
                const cert = simiManifest.connections[0].tls.cert;
    
                simiManifest.connections[0].tls.key  = Fs.readFileSync(key);
                simiManifest.connections[0].tls.cert = Fs.readFileSync(cert);
                simiManifest.connections[0].prot     = process.env.HTTPS_PORT;
            } else {
                simiManifest.connections[0].port     = process.env.HTTP_PORT;
            }
    
            return simiManifest;
        }
    }
    
    module.exports = ManifestBuilder;

    ```
    
    